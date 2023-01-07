import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            //component: () => import('./views/login.vue'),
            component: () => import('./views/layouts/Guest'),
            children: [
                {
                    path: '/',
                    name: 'login',
                    component: () => import('./views/login'),
                },
                {
                    path: '/login',
                    name: 'loginPage',
                    component: () => import('./views/login')
                },
                {
                    path: '/signup1',
                    name: 'signup1',
                    component: () => import('./views/signup1')
                },
                {
                    path: '/signup2',
                    name: 'signup2',
                    component: () => import('./views/signup2')
                },
            ]
        },

        {
            path: '/edit_profile',
            name: 'editprofile',
            //component: () => import('./views/users/profile.vue'),
            component: () => import('./views/layouts/App'),
            children: [
                {
                    path: '/',
                    name: 'profile',
                    component: () => import('./views/users/profile'),
                },
            ]
        },
        {
            path: '/follow',
            name: 'Follow',
            //component: () => import('./views/profile/follow.vue')
            component: () => import('./views/layouts/App'),
            children: [
                {
                    path: '/',
                    name: 'follow',
                    component: () => import('./views/profile/follow'),
                },
            ]
        },
        {
            path: '/posts',
            name: 'posts-container',
            component: () => import('./views/layouts/App'),
            children: [
                {
                    path: '/',
                    name: 'posts',
                    component: () => import('./views/posts'),
                },
            ]
        },
        {
            path: '/post_details',
            name: 'post_details',
            //component: () => import('./views/post_details.vue')
            component: () => import('./views/layouts/App'),
            children: [
                {
                    path: '/',
                    name: 'posts',
                    component: () => import('./views/posts'),
                },
            ]
        },
        {
            path: '/profile/:username',
            name: 'profile_view',
            //component: () => import('./views/profile/profile_view.vue'),
            component: () => import('./views/layouts/App'),
            children: [
                {
                    path: '/',
                    name: 'posts',
                    component: () => import('./views/profile/profile_view'),
                },
            ],
            props: true
        },
        {
            path: '/live',
            name: 'Live',
            //component: () => import('./views/live.vue'),
            component: () => import('./views/layouts/App'),
            children: [
                {
                    path: '/',
                    name: 'live',
                    component: () => import('./views/live'),
                },
            ],
        },
        {
            path: '/livestream/:id',
            name: 'livestream',
            //component: () => import('./views/live.vue'),
            component: () => import('./views/layouts/App'),
            children: [
                {
                    path: '/',
                    name: 'live stream',
                    component: () => import('./views/livestream'),
                },
            ],
        }, {
            path: '/create_stream',
            name: 'create_stream',
            //component: () => import('./views/live.vue'),
            component: () => import('./views/layouts/App'),
            children: [
                {
                    path: '/',
                    name: 'Create Stream',
                    component: () => import('./views/create_stream'),
                },
            ],
        }, {
            path: '/mystream',
            name: 'My stream',
            //component: () => import('./views/live.vue'),
            component: () => import('./views/layouts/App'),
            children: [
                {
                    path: '/',
                    name: 'My Stream',
                    component: () => import('./views/mystream'),
                },
            ],
        },
        {
            path: '/groups',
            name: 'Groups',
            //component: () => import('./views/groups/index.vue')
            component: () => import('./views/layouts/App'),
            children: [
                {
                    path: '/',
                    name: 'groups',
                    component: () => import('./views/groups/index'),
                },
            ],
        },

        {
            path: '/groups/:id',
            name: 'groupDetail',
            //component: () => import('./views/groups/detail.vue'),
            component: () => import('./views/layouts/App'),
            children: [
                {
                    path: '/',
                    name: 'group_detail',
                    component: () => import('./views/groups/detail'),
                },
            ],
        },

        {
            path: '/groups/:id/thread/:threadId/start-discussion',
            name: 'start_discussion',
            //component: () => import('./views/discussions/DiscussionPanel'),
            component: () => import('./views/layouts/App'),
            children: [
                {
                    path: '/',
                    name: 'start_discussion',
                    component: () => import('./views/discussions/DiscussionPanel'),
                },
            ],
        },
        {
            path: '/notifications',
            name: 'Notifications',
            //component: () => import('./views/notifications.vue'),

            component: () => import('./views/layouts/App'),
            children: [
                {
                    path: '/',
                    name: 'notifications',
                    component: () => import('./views/notifications'),
                },
            ],
        },
        {
            path: '/myposts',
            name: 'myPosts',
            component: () => import('./views/layouts/App'),
            children: [
                {
                    path: '/',
                    name: 'myposts',
                    component: () => import('./views/myposts'),
                },
            ],
        },
        {
            path: '/create_post',
            name: 'createPost',
            //component: () => import('./views/create_post.vue'),
            component: () => import('./views/layouts/App'),
            children: [
                {
                    path: '/',
                    name: 'create_post',
                    component: () => import('./views/create_post'),
                },
            ],
        },
        {
            path: '/addfriends',
            name: 'AddFriend',
            //component: () => import('./views/addfriends.vue'),
            component: () => import('./views/layouts/App'),
            children: [
                {
                    path: '/',
                    name: 'addfriends',
                    component: () => import('./views/addfriends'),
                },
            ],
        },
        {
            path: '/users',
            name: 'User',
            //component: () => import('./views/friends.vue'),
            component: () => import('./views/layouts/App'),
            children: [
                {
                    path: '/',
                    name: 'friends',
                    component: () => import('./views/friends'),
                },
            ],
        },

        {
            path: '/admin/login',
            name: 'admin_login',
            //component: () => import('./views/admin/admin_login'),
            component: () => import('./views/layouts/Guest'),
            children: [
                {
                    path: '/',
                    name: 'admin_login',
                    component: () => import('./views/admin/admin_login'),
                }
            ]
        },


        {
            path: '/admin',
            name: 'admin',
            //component: () => import('./views/admin/admin_login.vue'),
            component: () => import('./views/layouts/Admin'),
            children: [
                {
                    path: '/',
                    name: 'admin_index',
                    component: () => import('./views/admin/index')
                },
                /*{
                    path: '/',
                    name: 'admin_login',
                    component: () => import('./views/admin/admin_login'),
                },*/

                {
                    path: 'registered_users',
                    name: 'admin_users',
                    component: () => import('./views/admin/registered_users'),
                },
                {
                    path: 'index',
                    name: 'admin_index',
                    component: () => import('./views/admin/index')
                },
                {
                    path: '/user_view',
                    name: 'user_view',
                    component: () => import('./views/admin/user_view')
                },

                {
                    path: 'games',
                    name: 'games_list',
                    component: () => import('./views/admin/games/games')
                },
                {
                    path: 'games/create',
                    name: 'games_create',
                    component: () => import('./views/admin/games/create')
                },
                {
                    path: 'games/:id',
                    name: 'games_edit',
                    component: () => import('./views/admin/games/edit')
                },
                {
                    path: 'games/edit/:id',
                    name: 'games_edit',
                    component: () => import('./views/admin/games/edit')
                },

                {
                    path: 'groups',
                    name: 'groups_list',
                    component: () => import('./views/admin/groups/groups')
                },
                {
                    path: 'groups/create',
                    name: 'groups_create',
                    component: () => import('./views/admin/groups/create')
                },
                {
                    path: 'groups/:id',
                    name: 'groups_edit',
                    component: () => import('./views/admin/groups/edit')
                }
            ],
        }

    ]
})
