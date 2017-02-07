import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
/***********components***************/
import { DetailComponent } from './detail.component';

const routes = [
    { path: '', component: DetailComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    declarations: [DetailComponent]
})
export class DetailModule { }
