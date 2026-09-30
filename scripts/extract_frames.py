import os
import cv2
from PIL import Image

VIDEO_PATH = r"C:\Users\kaana\Downloads\0930 (2).mp4"
DEST_DIR = r"D:\portofolio\public\sequence"
TOTAL_TARGET_FRAMES = 180
TARGET_WIDTH = 1920
TARGET_HEIGHT = 1080

os.makedirs(DEST_DIR, exist_ok=True)

cap = cv2.VideoCapture(VIDEO_PATH)
total_video_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
print(f"Reading video: {total_video_frames} frames found in {VIDEO_PATH}")

step = total_video_frames / float(TOTAL_TARGET_FRAMES)
saved_count = 0

for i in range(TOTAL_TARGET_FRAMES):
    target_frame_idx = min(int(round(i * step)), total_video_frames - 1)
    cap.set(cv2.CAP_PROP_POS_FRAMES, target_frame_idx)
    ret, frame = cap.read()
    if not ret:
        print(f"Warning: could not read frame {target_frame_idx}")
        continue
    
    # BGR to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    img = Image.fromarray(rgb_frame)
    
    # Resize to Full HD 1920x1080 with high quality Lanczos filter
    img_resized = img.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.LANCZOS)
    
    # Save as WebP
    padded = f"{i + 1:03d}"
    out_file = os.path.join(DEST_DIR, f"frame_{padded}.webp")
    img_resized.save(out_file, "WEBP", quality=82, method=4)
    
    if i == 0:
        # Also save first frame as poster
        poster_path = os.path.join(r"D:\portofolio\public", "hero_poster.webp")
        img_resized.save(poster_path, "WEBP", quality=88)
        
    saved_count += 1
    if (i + 1) % 30 == 0:
        print(f"Extracted {i + 1}/{TOTAL_TARGET_FRAMES} frames...")

cap.release()
print(f"Successfully extracted and optimized {saved_count} frames to {DEST_DIR}!")
