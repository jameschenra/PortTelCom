import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

const routes = [
    {
        path     : 'user',
        loadChildren: './user/user.module#UserModule'
    },
    {
        path     : 'server',
        loadChildren: './server/server.module#ServerModule'
    },
    {
        path     : 'subplan',
        loadChildren: './subscription-plan/subscription-plan.module#SubscriptionPlanModule'
    },
    {
        path     : 'subscription',
        loadChildren: './subscription/subscription.module#SubscriptionModule'
    },
    {
        path     : 'country',
        loadChildren: './country/country.module#CountryModule'
    },
    {
        path     : 'session',
        loadChildren: './session/session.module#SessionModule'
    },
    {
        path     : '**',
        redirectTo: 'user'
    }
];

@NgModule({
    declarations: [ ],
    imports     : [
        RouterModule.forChild(routes),
    ],
})
export class ProtectedModule
{
}
