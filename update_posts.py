#!/usr/bin/env python3
import requests
import json

# API base URL
BASE_URL = "http://localhost:3000/api"

def get_posts():
    """Get all published posts"""
    response = requests.get(f"{BASE_URL}/posts")
    if response.status_code == 200:
        return response.json()['posts']
    return []

def update_post_content(slug, new_content):
    """Update post content"""
    response = requests.patch(
        f"{BASE_URL}/posts/{slug}",
        headers={"Content-Type": "application/json"},
        json={"content": new_content}
    )
    return response.status_code == 200

def main():
    posts = get_posts()
    
    for post in posts:
        print(f"Processing: {post['title']}")
        
        # Skip if already has h1 at the beginning
        if post['content'].startswith('<h1>'):
            print(f"  Skipping - already has h1")
            continue
            
        # Create new content with h1 and image
        title = post['title']
        main_image = post['mainImage']
        
        # Create h1 from title
        h1_content = f"<h1>{title}</h1>"
        
        # Create image tag
        image_content = f'<img src="{main_image}" alt="{title}" />'
        
        # Combine new content
        new_content = f"{h1_content}{image_content}{post['content']}"
        
        # Update the post
        if update_post_content(post['slug'], new_content):
            print(f"  ✅ Updated successfully")
        else:
            print(f"  ❌ Failed to update")

if __name__ == "__main__":
    main() 