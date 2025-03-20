import { Component, OnInit } from '@angular/core';
import { RegisterService } from '../../../services/couchdb.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';


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
  streamOptions: string[] = [];

  newPlan = {
    _id: `pricing_2_${uuidv4()}`,
    data: {
      planName: '',
      description: '',
      price:0,
      duration: 0,
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



  constructor(readonly registerService: RegisterService) { }

  ngOnInit(): void {
    this.fetchUserList();
    this.fetchSubstream();
  }
  fetchUserList() {
    this.registerService.getAllUser().subscribe({
      next: (response: any) => {
        console.log("res",response)
        this.userList = response.rows.map((row: any) => row.doc.data);
        console.log("in users", this.userList);
      },
      error: (err: any) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  fetchSubstream(): void {
    this.registerService.getStreams().subscribe({
      next: (response: any) => {
        console.log("getstream",response)
        this.streamNameIdMap.clear(); //Prevents duplicate data when re-fetching.
        response.rows.forEach((user: any) => {
          this.streamNameIdMap.set(user.value, user.key); //key-id value-streamname
        });
        this.streamOptions = Array.from(this.streamNameIdMap.keys()); //all stream names from streamNameIdMap and converts them into an array.
        console.log("option", this.streamOptions);
      },
      error: (error: any) => {
        console.error('Error fetching subStreams:', error);
      }
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

    const planData = {
      ...this.newPlan,
      createdAt: new Date().toISOString(),
    };

    this.registerService.addPlan(planData).subscribe({
      next: () => {
        alert('Plan added successfully.');
        this.resetForm();
        this.isFormVisible = false;
      },
      error: (err: any) => {
        console.error('Error adding plan:', err);
        alert('Failed to add plan. Please try again.');
      }
    });
  }

  addStreamsAndColleges() {

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
        streamName: this.newCourses.data.streamName.toLowerCase(),
        description: this.newCourses.data.description.toLowerCase(),
        imageUrl: this.newCourses.data.imageUrl.toLowerCase(),
        type: this.newCourses.data.type.toLowerCase(),
        createdAt: new Date().toISOString()
      }
    };

    this.registerService.addStreams(streamData).subscribe({
      next: (response: any) => {
        console.log("demo",response)
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
                this.resetForm();
              },
              error: (err: any) => {
                console.error('Error adding college:', err);
              }
            });
          });
        }
        alert('Course and associated colleges added successfully.');
        this.resetForm();
        this.isCoursesFormVisible = false;
      },
      error: (err: any) => {
        console.error('Error adding course:', err);
        alert('Failed to add course. Please try again.');
      }
    });
  }

  addSubstream() {

    this.isFormSubmitted = true;
    this.newSubstream.data.streamId = this.streamNameIdMap.get(this.selectedStream) ?? ""; //..

    if (!this.newSubstream.data.substreamName || !this.newSubstream.data.description || !this.newSubstream.data.extraDescription ||
      !this.newSubstream.data.duration || !this.newSubstream.data.extraImageUrl || !this.newSubstream.data.imageUrl) {
      alert("Please fill all fields.");
      return;
    }

    const substream = {
      ...this.newSubstream,
    };

    this.registerService.addPlan(substream).subscribe({
      next: () => {
        alert('Substream added successfully.');
        this.resetForm();
        this.isSubstreamFormVisible = false;
      },
      error: (err: any) => {
        console.error('Error adding substream:', err);
        alert('Failed to add substream. Please try again.');
      }
    });
  }

  addJobDetails() {

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
    this.registerService.addJob(jobData).subscribe({
      next: () => {
        alert('Job added successfully!');
        this.resetForm();
        this.isJobFormVisible = false;
      },
      error: (error: any) => {
        console.error('Error adding job:', error);
        alert('Failed to add job.');
      }
    });
  }

  resetForm() {
    this.newPlan = { _id: '', data: { planName: '', description: '', price: 0, duration: 0, type: 'pricing' }};
    this.newJob ={ _id: '', data: {  companyName: '', location: '', jobRole: '', email: '', applyLink: '', description: '', experience: '', type: 'job-details' }};
    this.newSubstream = { _id: '', data: { substreamName: '', description: '', imageUrl: '', extraDescription: '', extraImageUrl: '', duration: '', streamId: '', type: 'substream' }};
    this.newCourses = { _id: '', data: { streamName: '', description: '', imageUrl: '', colleges: '', type: 'stream' }};
  }
}