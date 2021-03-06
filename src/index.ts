import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, pluck, switchMap, tap } from 'rxjs/operators';
import './index.css';

type ICardItem = {
    archive_url: string,
    archived: boolean,
    assignees_url: string,
    blobs_url: string,
    branches_url: string,
    clone_url: string,
    collaborators_url: string,
    comments_url: string,
    commits_url: string,
    compare_url: string,
    contents_url: string,
    contributors_url: string,
    created_at: string,
    default_branch: string,
    deployments_url: string,
    description: string,
    downloads_url: string,
    events_url: string,
    fork: boolean,
    forks: number,
    forks_count: number,
    forks_url: string,
    full_name: string,
    git_commits_url: string,
    git_refs_url: string,
    git_tags_url: string,
    git_url: string,
    has_downloads: boolean,
    has_issues: boolean,
    has_pages: boolean,
    has_projects: boolean,
    has_wiki: boolean,
    homepage: string,
    hooks_url: string,
    html_url: string,
    id: number,
    issue_comment_url: string,
    issue_events_url: string,
    issues_url: string,
    keys_url: string,
    labels_url: string,
    language: string,
    languages_url: string,
    license: null,
    merges_url: string,
    milestones_url: string,
    mirror_url: null,
    name: string,
    node_id: string,
    notifications_url: string,
    open_issues: number,
    open_issues_count: number,
    owner: {
        avatar_url: string
        events_url: string
        followers_url: string
        following_url: string
        gists_url: string
        gravatar_id: string
        html_url: string
        id: number
        login: string
        node_id: string
        organizations_url: string
        received_events_url: string
        repos_url: string
        site_admin: boolean
        starred_url: string
        subscriptions_url: string
        type: string
        url: string
    },
    private: false,
    pulls_url: string,
    pushed_at: string,
    releases_url: string,
    score: number,
    size: number,
    ssh_url: string,
    stargazers_count: 1220,
    stargazers_url: string,
    statuses_url: string,
    subscribers_url: string,
    subscription_url: string,
    svn_url: string,
    tags_url: string,
    teams_url: string,
    trees_url: string,
    updated_at: string,
    url: string,
    watchers: number,
    watchers_count: number,
};

class Search {
    protected searchElement: HTMLElement;
    protected resultsContainer: HTMLElement;

    public constructor() {
        this.searchElement = document.getElementById('input') as HTMLElement;
        this.resultsContainer = document.getElementById('results') as HTMLElement;

        const sequence$: Observable<Event> = fromEvent(this.searchElement, 'input');

        Search.getSearchObservable(sequence$)
            .subscribe((result) => {
                this.resultsContainer.innerHTML = '';

                // is it needed to check in such way if we use Typescript ?
                if (result.items && Array.isArray(result.items)) {
                    this.resultsContainer.innerHTML = result.items
                        .reduce(
                            (acc: string, item: ICardItem) => {
                                return acc += Search.renderCard(item);
                            },
                            ''
                        );
                    }
                }
            );
    }

    // is it good to return type any ?
    public static getSearchObservable(source$: Observable<Event>): Observable<any> {
        return source$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            // pluck(),
            // tap(),
            map((event: Event) => (event.target as HTMLInputElement).value),
            switchMap((searchString: string) => {
                return (
                    fetch(`https://api.github.com/search/repositories?q=${searchString}`)
                        .then(res => res.json())
                );
            })
        );
    }

    public static renderCard(item: ICardItem): string {
        return `
            <li class="card">
                <h5 class="card__title">${item.name}</h5>
                <p class="card__text">${item.description}</p>
                <div class="cart__stars">Stars amount: <b>${item.stargazers_count}</b></div>
                <a href="${item.html_url}" class="card__link">Link to github</a>
            </li>
        `;
    }
}

// --------------------------------- Initialize our Search ---------------------------------
document.addEventListener('DOMContentLoaded', () => {
    new Search();
});
