import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'template', loadChildren: () => import('./features/template/template.module').then(m => m.TemplateModule) },
  { path: '**', redirectTo: 'template' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
