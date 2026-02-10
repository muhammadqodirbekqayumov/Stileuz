import os
import asyncio
from telethon import TelegramClient
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
API_ID = os.getenv('TELEGRAM_API_ID')
API_HASH = os.getenv('TELEGRAM_API_HASH')
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY') # Needs service role to write

# Initialize Clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
client = TelegramClient('stiluz_scraper_session', API_ID, API_HASH)

async def scrape_channel(channel_username):
    print(f"--- Scraping {channel_username} ---")
    
    # Check if brand exists in DB, if not create it
    brand_res = supabase.table('brands').select('id').eq('source_url', f"https://t.me/{channel_username}").execute()
    
    if len(brand_res.data) > 0:
        brand_id = brand_res.data[0]['id']
    else:
        print(f"Creating new brand: {channel_username}")
        new_brand = supabase.table('brands').insert({
            'name': channel_username,
            'type': 'telegram',
            'source_url': f"https://t.me/{channel_username}"
        }).execute()
        brand_id = new_brand.data[0]['id']

    # Scrape last 20 messages
    async for message in client.iter_messages(channel_username, limit=20):
        if message.photo:
            print(f"Found photo in message {message.id}")
            
            # Simple heuristic: If it has a photo, it might be a product
            # In a real app, we would download the photo to our storage bucket
            # For MVP, we'll try to get a public link or skip download logic for now
            # Telegram images expire, so we MUST upload to Supabase Storage in production
            
            # For this MVP, let's just log the text
            description = message.text or ""
            
            # TODO: Add logic to upload image to Supabase Storage and get URL
            # image_url = upload_to_supabase(message.photo)
            image_url = "PLACEHOLDER_UNTIL_STORAGE_SETUP" 
            
            # Basic parsing (Very naive)
            # Try to find price like "100 000" or "$"
            price = "N/A"
            if "so'm" in description:
                price = "Found in text"

            # Insert into Supabase
            data = {
                'brand_id': brand_id,
                'title': description[:50] + "...",
                'image_url': image_url, 
                'original_url': f"https://t.me/{channel_username}/{message.id}",
                'metadata': {'full_text': description},
                'category': 'upper_body' # Default
            }
            
            try:
                supabase.table('products').insert(data).execute()
                print(f"Saved product {message.id}")
            except Exception as e:
                print(f"Error saving: {e}")

async def main():
    await client.start()
    
    # Example Channels (Replace with real ones)
    target_channels = ['terrapro_uz', 'selfie_uz'] 
    
    for channel in target_channels:
        try:
            await scrape_channel(channel)
        except Exception as e:
            print(f"Failed to scrape {channel}: {e}")
            
    await client.disconnect()

if __name__ == '__main__':
    asyncio.run(main())
