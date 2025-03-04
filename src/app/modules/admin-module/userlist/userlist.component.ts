import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../../../services/register.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { ChatserviceService } from '../../../services/chatservice.service';


@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css'],
  providers: [RegisterService]
})
export class UserlistComponent implements OnInit {
  userList: any;
  isFormVisible = false;
  isCoursesFormVisible = false;
  isFormSubmitted = false;
  isJobFormVisible = false;
  isSubstreamFormVisible = false;
  subStreams: string[] = [];
  streamNameIdMap: Map<string, string> = new Map();
  selectedStream: string = "";

  intentsValues: any = "";
  intents: any;

  newPlan = {
    _id: `pricing_2_${uuidv4()}`,
    data: {
      planName: '',
      description: '',
      price:null,
      duration: null,
      type: 'pricing'
    }
  };

  newCourses = {
    _id: `stream_2_${uuidv4()}`,
    data: {
      streamName: '',
      description: '',
      imageUrl: '',
      colleges: '',
      type: 'stream'
    }
  };

  newSubstream = {
    _id: `substream_2_${uuidv4()}`,
    data: {
      streamId: '',
      substreamName: '',
      description: '',
      imageUrl: '',
      type: 'substream',
      extraDescription: '',
      extraImageUrl: '',
      duration: ''
    }
  };

  newJob = {
    _id: `job-details_2_${uuidv4()}`,
    data: {
      companyName: '',
      location: '',
      jobRole: '',
      email: '',
      applyLink: '',
      description: '',
      experience: '',
      type: 'job-details'
    }
  };

  streamOptions: string[] = [''];

  constructor(readonly registerService: RegisterService) { }

  ngOnInit(): void {
    this.fetchUserList();
    this.fetchSubstream();
    this.fetchCourses();
    this.getIntentsDoc();

  }

  getIntentsDoc() {
    this.registerService.getIntentDoc().subscribe({
      next: (response: any) => {
        const intentsData = {
          _id: response._id,
          _rev: response._rev,
          intents: response.intents
        };
        this.intents = intentsData;
      },
      error: (error: any) => {
        console.error('Error fetching intents:', error);
      }
    });
  }

  fetchUserList() {
    this.registerService.getAllUser().subscribe({
      next: (response: any) => {
        this.userList = response.rows.map((row: any) => row.doc.data);
        console.log("in users", this.userList);
      },
      error: (err: any) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  fetchSubstream(): void {
    this.registerService.getCourses().subscribe({
      next: (response: any) => {
        this.streamNameIdMap.clear();
        response.rows.forEach((user: any) => {
          this.streamNameIdMap.set(user.value, user.key);
        });
        this.streamOptions = Array.from(this.streamNameIdMap.keys());
        console.log("option", this.streamOptions);
      },
      error: (error: any) => {
        console.error('Error fetching subStreams:', error);
      }
    });
  }

  fetchCourses() {
    this.registerService.getCourses().subscribe({
      next: (response: any) => {
        this.subStreams = response.rows.map((row: any) => row);
        console.log("in fetch courses", this.subStreams);
      },
      error: (error: any) => console.error('Error fetching courses:', error)
    });
  }

  openForm(formType: string) {
    this.isFormVisible = false;
    this.isJobFormVisible = false;
    this.isCoursesFormVisible = false;
    this.isSubstreamFormVisible = false;

    if (formType === 'job') {
      this.isJobFormVisible = true;
    } else if (formType === 'courses') {
      this.isCoursesFormVisible = true;
    } else if (formType === 'substream') {
      this.isSubstreamFormVisible = true;
    } else if (formType === 'pricing') {
      this.isFormVisible = true;
    }
  }

  closeForm() {
    this.isFormVisible = false;
    this.isJobFormVisible = false;
    this.isCoursesFormVisible = false;
    this.isSubstreamFormVisible = false;
    this.resetForm();
  }

  addPlan(form:NgForm) {
    if(form.invalid){
      alert('Form is Invalid')
      return
    }

    const response = this.newPlan.data.description;
    const pattern = this.newPlan.data.planName;
    const generatedPatterns = this.registerService.generatePatterns(pattern);
    const newIntent = {
      tag: this.newPlan.data.planName,
      patterns: generatedPatterns,
      responses: [response],
      context: ['']
    };

    if (this.intents) {
      this.intents.intents.push(newIntent);
    }

    const planData = {
      ...this.newPlan,
      createdAt: new Date().toISOString(),
    };

    this.updateIntents();
    this.registerService.addPlan(planData).subscribe({
      next: () => {
        alert('Plan added successfully.');
        this.newPlan = { _id: `pricing_2_${uuidv4()}`, data: { planName: '', description: '', price: null, duration: null, type: 'pricing' } };
        this.isFormVisible = false;
      },
      error: (err: any) => {
        console.error('Error adding plan:', err);
        alert('Failed to add plan. Please try again.');
      }
    });
  }


  updateIntents() {
    this.registerService.updateIntent(this.intents).subscribe({
      next: (response: any) => {
        console.log('Intent updated successfully:', response);
        this.getIntentsDoc();
      },
      error: (error: any) => {
        if (error.status === 409) {
          console.warn("Conflict detected. Fetching latest _rev and retrying...");
          this.getIntentsDoc();
          setTimeout(() => this.updateIntents(), 500); // Retry after a short delay
        } else {
          console.error('Error updating intents:', error);
        }
      }
    });
  }

  addCoursesAndColleges() {
    const response = this.newCourses.data.description;
    const pattern = this.newCourses.data.streamName;
    const generatedPatterns = this.registerService.generatePatterns(pattern);
    const newIntent = {
      tag: this.newCourses.data.streamName,
      patterns: generatedPatterns,
      responses: [response],
      context: ['']
    };

    if (this.intents) {
      this.intents.intents.push(newIntent);
    }

    this.isFormSubmitted = true;

    if (!this.newCourses.data.streamName || !this.newCourses.data.description || !this.newCourses.data.imageUrl || !this.newCourses.data.colleges) {
      alert("Please fill all fields.");
      return;
    }

    const isStreamExists = this.streamOptions.some((course: any) =>
      course.toLowerCase() === this.newCourses.data.streamName.toLowerCase()
    );

    if (isStreamExists) {
      alert('Stream name already exists!');
      return;
    }

    const streamData = {
      _id: `stream_2_${uuidv4()}`,
      data: {
        streamName: this.newCourses.data.streamName,
        description: this.newCourses.data.description,
        imageUrl: this.newCourses.data.imageUrl,
        type: this.newCourses.data.type,
        createdAt: new Date().toISOString()
      }
    };

    this.updateIntents();
    this.registerService.addCourses(streamData).subscribe({
      next: (response: any) => {
        if (response && response.id) {
          const streamId = response.id;
          const collegesArray: string[] = this.newCourses.data.colleges.split(',').map(college => college.trim());

          collegesArray.forEach(collegeName => {
            const collegeData = {
              _id: `colleges_2_${uuidv4()}`,
              data: {
                collegeName: collegeName,
                streamId: streamId,
                type: "college",
                createdAt: new Date().toISOString()
              }
            };

            this.registerService.addColleges(collegeData).subscribe({
              next: (collegeResponse) => {
                console.log('Added:', collegeResponse);
              },
              error: (err: any) => {
                console.error('Error adding college:', err);
              }
            });
          });
        }
        alert('Course and associated colleges added successfully.');
        this.newCourses = { _id: '', data: { streamName: '', description: '', imageUrl: '', colleges: '', type: 'stream' } };
        this.isCoursesFormVisible = false;
      },
      error: (err: any) => {
        console.error('Error adding course:', err);
        alert('Failed to add course. Please try again.');
      }
    });
  }

  addSubstream() {
    const response = this.newSubstream.data.description;
    const pattern = this.newSubstream.data.substreamName;
    const generatedPatterns = this.registerService.generatePatterns(pattern);
    const newIntent = {
      tag: this.newSubstream.data.substreamName,
      patterns: generatedPatterns,
      responses: [response],
      context: ['']
    };
    if (this.intents) {
      this.intents.intents.push(newIntent);
    }

    this.isFormSubmitted = true;
    this.newSubstream.data.streamId = this.streamNameIdMap.get(this.selectedStream) ?? "";

    if (!this.newSubstream.data.substreamName || !this.newSubstream.data.description || !this.newSubstream.data.extraDescription ||
      !this.newSubstream.data.duration || !this.newSubstream.data.extraImageUrl || !this.newSubstream.data.imageUrl) {
      alert("Please fill all fields.");
      return;
    }

    const substream = {
      ...this.newSubstream,
    };

    this.updateIntents();
    this.registerService.addPlan(substream).subscribe({
      next: () => {
        alert('Substream added successfully.');
        this.isSubstreamFormVisible = false;
      },
      error: (err: any) => {
        console.error('Error adding substream:', err);
        alert('Failed to add substream. Please try again.');
      }
    });
  }

  addJobDetails() {
    const response = this.newJob.data.description;
    const generatedPatterns = this.registerService.generatePatterns(response);
    const newIntent = {
      tag: this.newJob.data.companyName,
      patterns: generatedPatterns,
      responses: [response],
      context: ['']
    };
    if (this.intents) {
      this.intents.intents.push(newIntent);
    }

    this.isFormSubmitted = true;

    if (!this.newJob.data.companyName || !this.newJob.data.location || !this.newJob.data.jobRole ||
      !this.newJob.data.email || !this.newJob.data.applyLink || !this.newJob.data.description ||
      !this.newJob.data.experience) {
      alert("Please fill all fields.");
      return;
    }

    const jobData = {
      ...this.newJob,
    };

    this.updateIntents();
    this.registerService.addJob(jobData).subscribe({
      next: () => {
        alert('Job added successfully!');
        this.newJob = { _id: '', data: { companyName: '', location: '', jobRole: '', email: '', applyLink: '', description: '', experience: '', type: 'job-details' } };
        this.isJobFormVisible = false;
      },
      error: (error: any) => {
        console.error('Error adding job:', error);
        alert('Failed to add job.');
      }
    });
  }
  resetForm() {
    this.newPlan.data = { planName: '', description: '', price: null, duration: null, type: '' };
    this.newJob.data = { companyName: '', location: '', jobRole: '', email: '', applyLink: '', description: '', experience: '', type: '' };
    this.newSubstream.data = { substreamName: '', description: '', imageUrl: '', extraDescription: '', extraImageUrl: '', duration: '', streamId: '', type: '' };
    this.newCourses.data = { streamName: '', description: '', imageUrl: '', colleges: '', type: '' };
  }
}