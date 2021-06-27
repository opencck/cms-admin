/**
 * Authorization middleware
 * @param store
 * @param redirect
 * @param $api
 * @param localePath
 */
export default function ({ store, redirect, app: { $api, localePath } }) {
    if (!store.state.user.id)
        return $api.get('users.auth').then(() => {
            if (!store.state.user.id) redirect(localePath('/login'));
        });
}
