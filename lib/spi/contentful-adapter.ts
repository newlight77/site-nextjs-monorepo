import { ContentfulClientApi, createClient, Entry, EntryCollection } from 'contentful'
import { Author } from '../../models/author';
import { BlogPost, BlogPostsPaginated, BlogPostsPaginatedFilter } from '../../models/blog.post';
import { Tag } from '../../models/tags';
import { ContentfulSpi, CONTENT_TYPE_BLOGPOST, CONTENT_TYPE_TAGS } from '../domain/contentful.service'

const spaceId = process.env.CONTENTFUL_SPACE_ID || ''
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN || ''


const client = createClient({
  space: spaceId,
  accessToken: accessToken
});


type Item = { sys: any, fields: any, };

class ContentfulAdapter implements ContentfulSpi {

  constructor(private client: ContentfulClientApi) {}

  async fetchAllTags(): Promise<Tag[]> {
    const content = await this.client.getEntries({
      content_type: CONTENT_TYPE_TAGS
    });

    return mapToTags(content.items);
  }

  async fetchBlogPosts(
    { limit, skip, tag }: BlogPostsPaginatedFilter = { limit: 5, skip: 0, tag: '' }
  ): Promise<BlogPostsPaginated> {
    const contents = await this.fetPosts(limit, skip, tag);
    const entries = mapToBlogPosts(contents.items);
    const total = contents.total;

    return { entries, total };
  }

  async fetchPostById(id: string): Promise<BlogPost | undefined> {
    try {
      console.log('fetchPostById, id', id)
      const content: any = await this.fetchById(id);
      console.log('fetchPostById, content', content)
      const item: Item = content.items[0];
      const author: Author = mapToAuthor(item);
      return mapToBlogPost(item, item.fields.tags, author);
    } catch (error) {
      console.error(error);
    }
  }

  async fetchSuggestions(tags: string[], max: number, currentArticleId: string): Promise<BlogPost[] | undefined> {
    let entries = [];

    const suggestionsByTags = await this.fetchSuggestionsByTags(max, tags, currentArticleId);

    entries = suggestionsByTags.items;
    if (suggestionsByTags.total < max) {
      const slugsToExclude = this.excludeSlugs(suggestionsByTags, currentArticleId);
      const limit = max - suggestionsByTags.total;
      const randomSuggestions = await this.fetchMoreRandomSuggestions(slugsToExclude, limit);

      entries = [...suggestionsByTags.items, ...randomSuggestions.items];
    }

    return mapToBlogPosts(entries);
  }

  private async fetchById(id: string): Promise<any> {
    return await this.client.getEntries({
      content_type: CONTENT_TYPE_BLOGPOST,
      'fields.id[e]': id
    });
  }

  private async fetPosts(limit: number | undefined, skip: number | undefined, tag: string | undefined) {
    return await this.client.getEntries({
      include: 1,
      limit,
      skip,
      order: 'fields.publishDate',
      'fields.tags.sys.id': tag,
      content_type: CONTENT_TYPE_BLOGPOST
    });
  }

  private async fetchSuggestionsByTags(limit: number, tags: string[], currentArticleId: string) {
    const initialOptions = {
      content_type: CONTENT_TYPE_BLOGPOST,
      limit,
      // find at least one matching tag, else undefined properties are not copied
      'fields.tags.sys.id[in]': tags.length ? tags.join(',') : undefined,
      'fields.id[ne]': currentArticleId // exclude current article
    };
    const suggestionsByTags = await this.client.getEntries(initialOptions);
    return suggestionsByTags;
  }

  private async fetchMoreRandomSuggestions(slugsToExclude: string, limit: number) {
    return await this.client.getEntries({
      content_type: CONTENT_TYPE_BLOGPOST,
      limit: limit,
      'fields.slug[nin]': slugsToExclude
    });
  }


  private excludeSlugs = (suggestionsByTags: EntryCollection<unknown>, currentArticleSlug: string) => {
    return [
      ...suggestionsByTags.items,
      { fields: { slug: currentArticleSlug } }
    ]
      .map((item: { fields: any; }) => item.fields.slug)
      .join(',');
  }

}


const mapToAuthor = (item: Item): Author => {
  return {
    id: item.fields.author.sys.id,
    name: item.fields.author.fields.name,
    title: item.fields.author.fields.title,
    company: item.fields.author.fields.company,
    shortBio: item.fields.author.fields.shortBio,
    email: item.fields.author.fields.email,
    twitter: item.fields.author.fields.twitter
  };
}

const mapToTags = (items: Entry<unknown>[]): Tag[] => {
  return items.map((item: Item) => ({
      id: item.sys.id,
      name: item.fields.name,
      color: 'grey'
    })
  );
}

const mapToBlogPost = (item: Item, tags: any, author: Author): BlogPost => {
  return {
    id: item.sys.id,
    slug: item.fields.slug,
    body: item.fields.body,
    title: item.fields.title,
    description: item.fields.description,
    tags: tags,
    heroImage: item.fields.heroImage.fields.file.url,
    author: author,
    publishedAt: item.fields.publishDate
      ? new Date(item.fields.publishDate)
      : new Date(item.sys.createdAt)
  };
}

const mapToBlogPosts = (entries: any): BlogPost[] => {
  return entries.map((item: Item) => {
    const author: Author = mapToAuthor(item);
    const tags = mapToTags(item.fields.tags);
    return mapToBlogPost(item, tags, author);
  });
}

export const contentfulAdapter = new ContentfulAdapter(client);

