import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable , throwError} from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class RegisterService {
  private baseUrl = 'https://192.168.57.185:5984/dpg_chatbot'; 
  private username = 'd_couchdb'; 
  private password = 'Welcome#2'; 

  private headers = new HttpHeaders({
    'Authorization': 'Basic ' + btoa(`${this.username}:${this.password}`),
    'Content-Type': 'application/json',
  });
  
  constructor(readonly http: HttpClient) {}

   // Register a new user
   registerUser(data: any){
    console.log("Registering user...");
    return this.http.post(this.baseUrl, data, { headers: this.headers });
  }

  // Get all users for the admin page
  getAllUser(): Observable<any> {
    const url = `${this.baseUrl}/_design/view/_view/register_by_email?include_docs=true`;
    return this.http.get<any>(url, { headers: this.headers });
  }
  // Check if a user exists by email
  checkUser(email: string): Observable<any> {
    const url = `${this.baseUrl}/_design/view/_view/register_by_email?key="${email}"&include_docs=true`;
    return this.http.get<any>(url, { headers: this.headers });
  }

  //For Session
  setUserdata(name: string) {
    localStorage.setItem('loggedInUser', JSON.stringify(name));
  }

  getUserdata(): string | null {
    const user = localStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
  }

  logOut() {
    localStorage.removeItem('loggedInUser');
  }
  // Add a new pricing plan
  addPlan(plan: any): Observable<any> {
    return this.http.post(this.baseUrl, plan, { headers: this.headers });
  }

  // Get all pricing plans
  getPlans(): Observable<any> {
    const url = `${this.baseUrl}/_design/view/_view/pricing_by_id?include_docs=true`;
    return this.http.get(url, { headers: this.headers });
  }

  // Add a new job
  addJob(jobData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, jobData, { headers: this.headers }).pipe(
      catchError(error => {
        console.error('Error adding job:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  // Get all jobs
  getJobs(): Observable<any> {
    const url = `${this.baseUrl}/_design/view/_view/jobdetails_by_id?include_docs=true`;
    return this.http.get<any>(url, { headers: this.headers });
  }

  // Add a new course
  addStreams(course: any): Observable<any> {
    return this.http.post(this.baseUrl, course, { headers: this.headers });
  }

  // Get all courses
  getStreams(): Observable<any> {
    const url = `${this.baseUrl}/_design/view/_view/stream_by_id?include_docs=true`;
    return this.http.get(url, { headers: this.headers });
  }

  // Add a new college
  addColleges(college: any): Observable<any> {
    return this.http.post(this.baseUrl, college, { headers: this.headers });
  }

  // Get colleges by stream ID
  getColleges(streamId: any): Observable<any> {
    const url = `${this.baseUrl}/_design/view/_view/colleges_by_streamid?key="${streamId}"&include_docs=true`;
    console.log(url);
    return this.http.get(url, { headers: this.headers });
  }

  // Add a new substream
  addSubstream(substream: any): Observable<any> {
    return this.http.post(this.baseUrl, substream, { headers: this.headers });
  }

  // Get all substreams
  getSubstream(): Observable<any> {
    const url = `${this.baseUrl}/_design/view/_view/substream_by_streamid?include_docs=true`;
    return this.http.get(url, { headers: this.headers });
  }

  getParticularSubStream(subStreamId : any){
    const url = `${this.baseUrl}/${subStreamId}`;
    return this.http.get(url, { headers: this.headers });
  }

  updateSubStream(subStreamData: any){
    const url = `${this.baseUrl}/${subStreamData._id}`;
    return this.http.put(url, subStreamData, { headers: this.headers });
  }

  getClickCount():Observable<any>{
    const url = `${this.baseUrl}/_design/view/_view/trendingcourses_by_substreamid?descending=true`;
    return this.http.get(url, { headers: this.headers });
  }

  //search query
  getSearchStream(stream:string):Observable<any>{
    const url=`${this.baseUrl}/_design/search_index/_search/stream?q=stream:${encodeURIComponent(stream)}*&wildcard=true&include_docs=true`;
    return this.http.get(url,{headers:this.headers});
  }
}
