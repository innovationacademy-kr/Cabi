import { Repository } from 'typeorm';

export const extendPostRepository = <T>(repository: Repository<T>) => {
  return repository.extend({
    async saveWithSlug(slug: string) {
      return this.save({ slug, message: slug });
    },
  });
};
