import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'user',
                title    : 'User',
                // translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
                icon     : 'account_circle',
                url      : '/panel/user'
            },
            {
                id       : 'server',
                title    : 'Server',
                type     : 'item',
                icon     : 'desktop_mac',
                url      : '/panel/server'
            },
            {
                id       : 'subscription_plan',
                title    : 'Subscription Plan',
                type     : 'item',
                icon     : 'collections',
                url      : '/panel/subplan'
            },
            {
                id       : 'subscription',
                title    : 'Subscription',
                type     : 'item',
                icon     : 'layers',
                url      : '/panel/subscription'
            },
            {
                id       : 'country',
                title    : 'Country',
                type     : 'item',
                icon     : 'layers',
                url      : '/panel/country'
            },
            {
                id       : 'session',
                title    : 'Session',
                type     : 'item',
                icon     : 'layers',
                url      : '/panel/session'
            }
        ]
    }
];
