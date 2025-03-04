import { Routes } from '@angular/router';
import { HomecomponentComponent } from './modules/student-module/homecomponent/homecomponent.component';
import { CommonloginComponent } from './login/commonlogin/commonlogin.component';
import { RegisterComponent } from './login/register/register.component';

import { UserlistComponent } from './modules/admin-module/userlist/userlist.component';
import { PersonalassessmentComponent } from './modules/student-module/personalassessment/personalassessment.component';
import { ChatbotmoduleComponent } from './modules/chatbotmodule/chatbotmodule.component';
import { JobdetailComponent } from './modules/jobseeker-module/jobdetail/jobdetail.component';
import { CoursedetailsComponent } from './modules/student-module/coursedetails/coursedetails.component';
import { SubstreamsComponent } from './modules/student-module/substreams/substreams.component';
import { SubstreamdetailsComponent } from './modules/student-module/substreamdetails/substreamdetails.component';
import { TrendingCoursesComponent } from './modules/student-module/trending-courses/trending-courses.component';
import { AdminHomepageComponent } from './modules/admin-module/admin-homepage/admin-homepage.component';
import { D3PieChartComponent } from './modules/student-module/d3-pie-chart/d3-pie-chart.component';
// import { authGuard } from './services/auth.guard';

export const routes: Routes = [
    {path : "", redirectTo : 'home', pathMatch: 'full'},
    {path:'home',component:HomecomponentComponent},
    {path:'stream/:id',component:SubstreamsComponent},
    {path:'substream/:id',component:SubstreamdetailsComponent},
    {path:'commonlogin',component:CommonloginComponent}, //,canActivate:[authGuard]
    {path:'register',component:RegisterComponent},
    {path:'userlist',component:UserlistComponent},
    {path:'personalassessment',component:PersonalassessmentComponent},
    {path:'chatbotmodule',component:ChatbotmoduleComponent},
    {path:'jobdetail',component:JobdetailComponent},
    {path:'coursedetails',component:CoursedetailsComponent},
    {path:'course',component:TrendingCoursesComponent},
    {path:'adminhome',component:AdminHomepageComponent},
    {path:'chart',component:D3PieChartComponent}
];
