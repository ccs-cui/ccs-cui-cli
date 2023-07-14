'use strict';

const axios = require('axios')
const urlJoin = require('url-join')
const semver = require('semver')

function getNpmInfo(npmName, registry) {
    if (!npmName) {
        return null
    }
    const registryUrl = registry || getDefaultRegisry()
    const npmInfoUrl = urlJoin(registryUrl, npmName)
    return axios.get(npmInfoUrl).then(res => {
        if (res.status === 200) {
            return res.data
        }
        return null
    }).catch(err => {
        return Promise.reject(err)
    })
}

function getDefaultRegisry(isOriginal = false) {
    return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npmmirror.com'
}

async function getNpmVersions(npmName, registry) {
    const data = await getNpmInfo(npmName, registry)
    if (data) {
        return Object.keys(data.versions)
    }
    return []
}

function getSemverVersions(baseVersion, versions) {
    return versions
    .filter(version => 
        semver.satisfies(version, `^${baseVersion}`)
    ).sort((a, b) => 
        semver.gt(b, a)
    )
}

async function getNpmSemverVersion(baseVersion, npmName, registry) {
    const versions = await getNpmVersions(npmName, registry)
    const newVersions = getSemverVersions(baseVersion, versions)
    // console.log(newVersions)
    if (newVersions && newVersions.length > 0) {
        return newVersions[0]
    }
}

async function getNpmLastestVersion(npmName, registry) {
    let versions = await getNpmVersions(npmName, registry)
    if (versions) {
        return versions.sort((a, b) => {
            if (semver.gt(b, a)) {
                return 1
            }
            return -1
        })[0]
    }
    return null
}

module.exports = {
    getNpmInfo,
    getNpmVersions,
    getNpmSemverVersion,
    getDefaultRegisry,
    getNpmLastestVersion
};
