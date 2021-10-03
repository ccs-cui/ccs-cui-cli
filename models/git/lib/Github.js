const GitServer = require('./GitServer')
const GithubRequest = require('./GithubRequest')

class Github extends GitServer {
    constructor() {
        super('github')
        this.request = null
    }

    setToken(token) {
        super.setToken(token)
        this.request = new GithubRequest(token)

    }

    getUser() {
        return this.request.get('/user')
    }

    getOrg() {
        return this.request.get(`/user/orgs`, {
            page: 1,
            per_page: 100
        })
    }

    getRepo(login, name) {
        return this.request
            .get(`/repos/${login}/${name}`)
            .then(response => {
                return this.handleResponse(response);
            });
    }

    createRepo(name) {
        return this.request.post('/user/repos', {
            name,
        })
    }

    createOrgRepo(name, login) {
        return this.request.post(`/orgs/${login}/repos`, {
            name,
        }, {
            Accept: 'application/vnd.github.v3+json',
        })
    }

    getTokenUrl() {
        return 'https://github.com/settings/tokens'
    }
    
    getTokenHelpUrl() {
        return 'https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh'
    }

    getRemote(login, name) {
        return `git@github.com:${login}/${name}.git`
    }
}

module.exports = Github