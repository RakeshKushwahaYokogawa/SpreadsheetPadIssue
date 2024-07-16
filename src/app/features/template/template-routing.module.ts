import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from './pages/edit/edit.component';

const routes: Routes = [
  { path: 'edit/:id', component: EditComponent },
  { path: '**', redirectTo: 'edit/test' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplateRoutingModule { }
