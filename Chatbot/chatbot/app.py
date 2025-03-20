# app.py
import json
import numpy as np
import faiss
import os
import requests
import time
import cohere
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import urllib3
from Levenshtein import ratio
import threading

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
load_dotenv()

# Configuration
COUCHDB_URL = "https://192.168.57.185:5984"
DATABASE_NAME = "dpg_chatbot"
USERNAME = "d_couchdb"
PASSWORD = "Welcome#2"
DATA_FILE = r"C:\Users\kavicon400\Career-Guidance-chatbot\Chatbot\chatbot\colleges.json"
COHERE_API_KEY = "Vvp0XvPYQ10UGSYflRJmrZb8VQFWAYkPI8bw7Dnj"

# Initialize Cohere client
co = cohere.Client(COHERE_API_KEY)
model = SentenceTransformer('all-MiniLM-L6-v2')

# Shared data structures
data_lock = threading.Lock()
cached_data = None
cached_index = None

def fetch_couchdb_data(view_name):
    try:
        url = f"{COUCHDB_URL}/{DATABASE_NAME}/_design/view/_view/{view_name}?include_docs=true"
        response = requests.get(url, auth=(USERNAME, PASSWORD), verify=False, timeout=10)
        response.raise_for_status()
        return [row["doc"]["data"] for row in response.json().get("rows", []) if "doc" in row]
    except Exception as e:
        print(f"Error fetching CouchDB data: {e}")
        return []

def preprocess_data(colleges, substreams):
    # Process colleges
    for college in colleges:
        # Standardize course formats
        courses = college.get('Courses', [])
        if isinstance(courses, str):
            courses = [c.strip() for c in courses.split(',') if c.strip()]
        
        # Add special course markers
        college["_courses_lower"] = [c.lower() for c in courses]
        
        # Build comprehensive text
        college["Combined Text"] = (
            f"INSTITUTION: {college.get('College Name', 'N/A')} | "
            f"TYPE: {college.get('College Type', 'N/A')} | "
            f"LOCATION: {college.get('City', 'N/A')}, {college.get('State', 'N/A')} | "
            f"RATING: {college.get('Rating', 'N/A')}/5 | "
            f"COURSES: {', '.join(courses)} | "
            f"CUTOFF: {college.get('cut_off', 'N/A')} | "
            f"PLACEMENTS: {college.get('Placement Stats', {}).get('average_package', 'N/A')} LPA avg | "
            f"EXAMS: {', '.join(college.get('Entrance Exams', ['N/A']))}"
        )

    # Process courses
    for course in substreams:
        course["Combined Text"] = (
            f"COURSE: {course.get('substream_Name', 'N/A')} | "
            f"DURATION: {course.get('duration', 'N/A')} years | "
            f"DESCRIPTION: {course.get('description', 'N/A')}"
        )

    return colleges + substreams

def generate_embeddings(data):
    texts = [entry["Combined Text"] for entry in data]
    return model.encode(texts, show_progress_bar=False)

def build_faiss_index(embeddings):
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(embeddings)
    return index

def search_faiss_index(query, top_k=5):
    global cached_index, cached_data
    with data_lock:
        index = cached_index
        data = cached_data
    
    query_embedding = model.encode([query])
    distances, indices = index.search(query_embedding, top_k)
    
    # Boost course matches using direct string check
    query_lower = query.lower()
    course_matches = []
    other_matches = []
    
    for idx in indices[0]:
        entry = data[idx]
        if 'INSTITUTION' in entry["Combined Text"]:
            # College entry
            if any(course in query_lower for course in entry.get("_courses_lower", [])):
                course_matches.append(entry)
            else:
                other_matches.append(entry)
        else:
            # Course entry
            other_matches.append(entry)
    
    return (course_matches + other_matches)[:top_k]

def refresh_data():
    global cached_data, cached_index
    try:
        print("Refreshing dataset...")
        with open(DATA_FILE, 'r') as f:
            local_data = json.load(f)
        substream_data = fetch_couchdb_data("substream_by_streamid")
        merged_data = preprocess_data(local_data, substream_data)
        embeddings = generate_embeddings(merged_data)
        
        with data_lock:
            cached_data = merged_data
            cached_index = build_faiss_index(embeddings)
        print("Dataset refresh complete")
    except Exception as e:
        print(f"Refresh error: {e}")

class DataRefresher(threading.Thread):
    def __init__(self):
        super().__init__(daemon=True)
        self.last_check = time.time()

    def run(self):
        while True:
            if time.time() - self.last_check > 300:
                refresh_data()
                self.last_check = time.time()
            time.sleep(60)

DataRefresher().start()

def generate_response(query):
    # Handle specific query patterns
    query_lower = query.lower()
    
    # 1. Top colleges query
    if "top" in query_lower and ("engineering" in query_lower or "college" in query_lower):
        results = search_faiss_index(query, top_k=5)
        colleges = [entry for entry in results if "INSTITUTION" in entry["Combined Text"]]
        colleges.sort(key=lambda x: float(x.get("Rating", 0)), reverse=True)
        
        response = []
        for i, college in enumerate(colleges[:3]):
            details = {
                'name': college.get('College Name'),
                'rating': college.get('Rating'),
                'location': f"{college.get('City')}, {college.get('State')}",
                'courses': ', '.join(college.get('Courses', [])[:3]),
                'placement': college.get('Placement Stats', {}).get('average_package')
            }
            response.append(
                f"{i+1}. {details['name']} ({details['rating']}/5)\n"
                f"   Location: {details['location']}\n"
                f"   Key Courses: {details['courses']}\n"
                f"   Avg Package: {details['placement']} LPA"
            )
        return "\n\n".join(response)
    
    # 2. Course availability query
    if "offer" in query_lower or "courses" in query_lower:
        course_keywords = ["computer science", "cse", "engineering"]
        if any(kw in query_lower for kw in course_keywords):
            results = search_faiss_index("computer science engineering", top_k=10)
            colleges = []
            for entry in results:
                if "INSTITUTION" in entry["Combined Text"]:
                    courses = entry.get("_courses_lower", [])
                    if any("computer science" in c for c in courses):
                        colleges.append(entry)
            
            if not colleges:
                return "No colleges offering Computer Science Engineering found in current data."
            
            response = ["Colleges offering Computer Science Engineering:"]
            for college in colleges[:5]:
                response.append(
                    f"- {college['College Name']} ({college.get('Rating')}/5)\n"
                    f"  Location: {college.get('City')}\n"
                    f"  Entrance Exams: {', '.join(college.get('Entrance Exams', ['N/A']))}"
                )
            return "\n\n".join(response)
    
    # General query handling
    results = search_faiss_index(query)
    
    if not results:
        return "I can help with college and course information. Please rephrase your question."
    
    context = "\n".join([f"- {entry['Combined Text']}" for entry in results])
    
    prompt = f"""You are an academic advisor. Follow these rules STRICTLY:
    1. Answer ONLY using the context below
    2. Be specific with names, numbers, and metrics
    3. For comparisons, sort by rating descending
    4. List all relevant options
    5. Never say "I don't have information" - use "Data not available" for missing fields
    
    Context:
    {context}
    
    Query: {query}
    
    Structured Response:"""
    
    try:
        response = co.generate(
            model='command',
            prompt=prompt,
            max_tokens=500,
            temperature=0.2,
            stop_sequences=["\n\n"],
            return_likelihoods='NONE'
        )
        return response.generations[0].text.strip()
    except Exception as e:
        return "Unable to generate response. Please try again."

def main():
    if not os.path.exists(DATA_FILE):
        print(f"Error: Data file missing at {DATA_FILE}")
        return

    print("Academic Assistant Ready!\n")
    while True:
        try:
            query = input("Your query (type 'exit' to quit): ").strip()
            if query.lower() in ['exit', 'quit']:
                break
                
            start = time.time()
            response = generate_response(query)
            print(f"\nResponse ({time.time()-start:.2f}s):\n{response}\n")
            
        except KeyboardInterrupt:
            break

if __name__ == "__main__":
    refresh_data()
    main()