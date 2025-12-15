export default {
  register() {},
  async bootstrap({ strapi }) {
    // Ensure Article content-type exists
    try {
      // Set public permissions for find
      const role = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
      if (role) {
        const permissions = await strapi.query('plugin::users-permissions.permission').findMany({ where: { role: role.id } });
        const hasFind = permissions?.some(p => p.action === 'api::article.article.find');
        if (!hasFind) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: { action: 'api::article.article.find', role: role.id, enabled: true }
          });
        }
      }
    } catch (e) {
      strapi.log.warn('Could not set public permissions automatically: ' + e.message);
    }

    // Seed one article if none
    try {
      const count = await strapi.entityService.count('api::article.article');
      if (count === 0) {
        await strapi.entityService.create('api::article.article', {
          data: { title: 'Hello Strapi', content: 'This is a seeded article.', publishedAt: new Date() }
        });
        strapi.log.info('Seeded default article');
      }
    } catch (e) {
      strapi.log.warn('Could not seed article: ' + e.message);
    }
  },
};
