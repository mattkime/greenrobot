let GitHubApi = require('github');
let { token } = require('./config');
let Rx = require('rxjs');

var github = new GitHubApi();

github.authenticate({
	type: "token",
	token // generate a token at https://github.com/settings/tokens and save to config.json with token as key
});

let getPRs$ = Rx.Observable.bindNodeCallback(github.pullRequests.getAll)

getPRs$({
        owner: 'meetup',
        repo:'mup-web',
        state: 'open',
    })
    .pluck('data')
    .flatMap(Rx.Observable.from)
    .filter( pr => pr.head.ref.startsWith('greenkeeper/'))
    .do(item => console.log(item.head.ref))
    .subscribe(null, null, () => console.log('done'));
