import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from './pages/edit/edit.component';

const routes: Routes = [
  { path: 'edit/:id', component: EditComponent },
  { path: '**', redirectTo: 'edit/9e6d42cb-e179-4951-aaa5-cadb53689999' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplateRoutingModule { }
