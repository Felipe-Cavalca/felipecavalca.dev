// Desestruturação do objeto context.repo para obter o proprietário e o repositório
const { owner, repo } = context.repo

// Obtenção da lista de releases do repositório atual
const releases = await github.repos.listReleases({
    owner,
    repo,
})

// Busca por um release que ainda está em rascunho (draft)
const draftRelease = releases.data.find(release => release.draft)

// Obtenção do número do pull request a partir do payload do contexto
const prNumber = context.payload.pull_request.number

// Obtenção das labels do pull request atual. A função listLabelsOnIssue é chamada com o proprietário, o repositório e o número do pull request.
// O resultado é mapeado para obter apenas os nomes das labels.
const labels = (await github.issues.listLabelsOnIssue({ owner, repo, issue_number: prNumber })).data.map(label => label.name)

// Se um release em rascunho for encontrado
if (draftRelease) {
    // Obtenção da última tag do repositório
    const lastTag = (await github.repos.listTags({ owner, repo })).data.map(tag => tag.name).sort().pop()

    // Atualização do release em rascunho com a última tag, alterando o nome para remover hífens e substituí-los por parênteses
    // Além disso, o release é marcado como não sendo mais um rascunho (draft: false) e como pré-release (prerelease: true)
    await github.repos.updateRelease({
        owner,
        repo,
        release_id: draftRelease.id,
        tag_name: lastTag,
        name: lastTag.trim().replace(/-/g, ' (') + ')',
        draft: false,
        prerelease: labels.includes('release'),
    })
}
