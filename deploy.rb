require 'aws-sdk-s3'
require 'dotenv'
require 'mime/types'
require 'aws-sdk-cloudfront'

Dotenv.load

cloudfront = Aws::CloudFront::Client.new(region: 'us-west-2')
distribution_id = ENV['CLOUDFRONT_DISTRIBUTION_ID']

# Configuration
s3 = Aws::S3::Resource.new(region: 'us-west-2')
bucket_name = 'dadgriller'
bucket = s3.bucket(bucket_name)
folder_path = './_site'

# Get list of local files (ignoring hidden/system files)
files = Dir.glob("#{folder_path}/**/*", File::FNM_DOTMATCH).reject do |file|
  File.directory?(file) || file =~ /\/\.(?!well-known)/ || file =~ /\.git|node_modules|Gemfile|\.env/
end

# Helper to convert local file path to S3 key
def local_to_s3_key(file, folder_path)
  file.sub(/^#{folder_path}\//, '')
end

# Delete files from S3 that no longer exist locally
puts "Checking for files to delete on S3..."
bucket.objects.each do |obj|
  local_file_path = File.join(folder_path, obj.key)
  unless files.include?(local_file_path)
    puts "Deleting #{obj.key} from S3..."
    obj.delete
  end
end

# Upload files to S3
puts "Uploading files to S3..."
files.each_with_index do |file, index|
  s3_key = local_to_s3_key(file, folder_path)
  content_type = MIME::Types.type_for(file).first&.content_type || 'application/octet-stream'

  puts "[#{index + 1}/#{files.size}] Uploading #{file} as #{s3_key} with content type #{content_type}..."
  bucket.object(s3_key).upload_file(file, content_type: content_type)
end

puts "Sync complete!"

puts "Creating CloudFront invalidation..."

resp = cloudfront.create_invalidation(
  distribution_id: distribution_id,
  invalidation_batch: {
    paths: {
      quantity: 1,
      items: ["/*"]
    },
    caller_reference: "deploy-#{Time.now.to_i}"
  }
)

puts "Invalidation created! ID: #{resp.invalidation.id}"
puts "Status: #{resp.invalidation.status}"