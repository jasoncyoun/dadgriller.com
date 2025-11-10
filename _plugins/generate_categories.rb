# _plugins/generate_categories.rb
module Jekyll
  class CategoryPageGenerator < Generator
    safe true
    priority :low  # ensure it runs after posts are loaded

    def generate(site)
      site.categories.each do |category, posts|
        site.pages << CategoryPage.new(site, category, posts)
      end

      # explicitly log and add the index page
      puts "[dadgriller] Generating category index..."
      site.pages << CategoryIndexPage.new(site, site.categories)
    end
  end

  class CategoryPage < Page
    def initialize(site, category, posts)
      @site = site
      @base = site.source
      @dir  = File.join('categories', category.downcase.gsub(' ', '-'))
      @name = 'index.html'

      self.process(@name)
      self.read_yaml(File.join(@base, '_layouts'), 'category.html')
      self.data['title'] = category.capitalize
      self.data['category'] = category.downcase
      self.data['posts'] = posts
    end
  end

  class CategoryIndexPage < Page
    def initialize(site, categories)
      @site = site
      @base = site.source
      @dir  = 'categories'
      @name = 'index.html'

      self.process(@name)
      layout_path = File.join(@base, '_layouts', 'categories_index.html')
      unless File.exist?(layout_path)
        puts "[dadgriller] ⚠️  Layout not found: #{layout_path}"
      end
      self.read_yaml(File.join(@base, '_layouts'), 'categories_index.html')
      self.data['title'] = 'Categories'
      self.data['categories'] = categories
    end
  end
end
