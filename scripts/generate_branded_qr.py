import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_qr_with_logo(qr_path, logo_path, output_path, logo_scale=0.23):
    qr = Image.open(qr_path).convert("RGBA")
    logo = Image.open(logo_path).convert("RGBA")

    qr_w, qr_h = qr.size
    logo_size = int(qr_w * logo_scale)

    # Resize logo with high quality
    logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)

    # Create a circular white mask for background padding around logo
    pad = int(logo_size * 0.08)
    bg_size = logo_size + pad * 2

    # Draw rounded / circular white background
    bg = Image.new("RGBA", (bg_size, bg_size), (0, 0, 0, 0))
    bg_draw = ImageDraw.Draw(bg)
    bg_draw.ellipse([0, 0, bg_size, bg_size], fill=(255, 255, 255, 255))

    # Optional subtle gold border around logo circle
    gold_border = (200, 160, 89, 255)
    border_width = 8
    bg_draw.ellipse([2, 2, bg_size - 2, bg_size - 2], outline=gold_border, width=border_width)

    # Paste logo onto background
    bg.paste(logo, (pad, pad), logo)

    # Calculate center position
    pos_x = (qr_w - bg_size) // 2
    pos_y = (qr_h - bg_size) // 2

    qr.paste(bg, (pos_x, pos_y), bg)
    qr.save(output_path, "PNG", quality=100)
    print(f"Created QR with logo: {output_path}")
    return qr

def create_table_stand_display(
    qr_with_logo_path,
    output_path,
    title="SCAN TO VISIT OUR WEBSITE",
    subtitle="Point your camera to explore our luxury bespoke automotive services",
    url_text="www.walessgroup.ae",
    badge_label="OFFICIAL WEBSITE"
):
    W, H = 1800, 2400
    img = Image.new("RGBA", (W, H), (10, 14, 23, 255)) # Dark luxury navy/carbon
    draw = ImageDraw.Draw(img)

    # Outer decorative gold border
    gold = (212, 175, 55, 255)
    gold_soft = (180, 145, 65, 200)
    gold_light = (245, 225, 165, 255)
    white = (255, 255, 255, 255)
    gray = (160, 174, 192, 255)

    # Border frame
    draw.rectangle([40, 40, W - 40, H - 40], outline=gold, width=4)
    draw.rectangle([55, 55, W - 55, H - 55], outline=(40, 48, 65, 255), width=2)

    # Corner accents
    corner_len = 50
    for cx, cy in [(40, 40), (W-40, 40), (40, H-40), (W-40, H-40)]:
        x_dir = 1 if cx == 40 else -1
        y_dir = 1 if cy == 40 else -1
        draw.line([cx, cy, cx + x_dir * corner_len, cy], fill=gold, width=8)
        draw.line([cx, cy, cx, cy + y_dir * corner_len], fill=gold, width=8)

    # Load fonts
    font_bold = "C:\\Windows\\Fonts\\segoeuib.ttf"
    font_reg = "C:\\Windows\\Fonts\\segoeui.ttf"
    if not os.path.exists(font_bold):
        font_bold = "C:\\Windows\\Fonts\\arialbd.ttf"
        font_reg = "C:\\Windows\\Fonts\\arial.ttf"

    f_brand = ImageFont.truetype(font_bold, 54)
    f_subbrand = ImageFont.truetype(font_reg, 24)
    f_badge = ImageFont.truetype(font_bold, 24)
    f_title = ImageFont.truetype(font_bold, 48)
    f_sub = ImageFont.truetype(font_reg, 28)
    f_url = ImageFont.truetype(font_bold, 44)
    f_footer = ImageFont.truetype(font_reg, 24)

    # Top Brand Logo
    logo_path = "c:\\uae-carservice\\public\\waless-logo.png"
    if os.path.exists(logo_path):
        top_logo = Image.open(logo_path).convert("RGBA")
        top_logo = top_logo.resize((180, 180), Image.Resampling.LANCZOS)
        img.paste(top_logo, ((W - 180) // 2, 100), top_logo)

    # Brand Title
    brand_text = "WALESS GROUP"
    b_box = draw.textbbox((0, 0), brand_text, font=f_brand)
    b_w = b_box[2] - b_box[0]
    draw.text(((W - b_w) // 2, 305), brand_text, font=f_brand, fill=gold_light)

    sub_brand = "RAS AL KHAIMAH  •  UNITED ARAB EMIRATES"
    sb_box = draw.textbbox((0, 0), sub_brand, font=f_subbrand)
    sb_w = sb_box[2] - sb_box[0]
    draw.text(((W - sb_w) // 2, 375), sub_brand, font=f_subbrand, fill=gray)

    # Gold Divider line with diamond center
    y_div = 430
    draw.line([250, y_div, W - 250, y_div], fill=gold_soft, width=2)
    draw.polygon([(W//2 - 8, y_div), (W//2, y_div - 8), (W//2 + 8, y_div), (W//2, y_div + 8)], fill=gold)

    # Badge Pill (e.g. OFFICIAL WEBSITE or VIP LOYALTY)
    badge_box = draw.textbbox((0, 0), badge_label, font=f_badge)
    badge_w = badge_box[2] - badge_box[0]
    pad_h, pad_v = 36, 12
    pill_w = badge_w + pad_h * 2
    pill_h = (badge_box[3] - badge_box[0]) + pad_v * 2
    pill_x1 = (W - pill_w) // 2
    pill_y1 = 470
    draw.rounded_rectangle([pill_x1, pill_y1, pill_x1 + pill_w, pill_y1 + 44], radius=22, fill=(26, 32, 48, 255), outline=gold, width=2)
    draw.text(((W - badge_w) // 2, pill_y1 + 10), badge_label, font=f_badge, fill=gold)

    # Main Headline
    t_box = draw.textbbox((0, 0), title, font=f_title)
    t_w = t_box[2] - t_box[0]
    draw.text(((W - t_w) // 2, 545), title, font=f_title, fill=white)

    # Subtitle
    s_box = draw.textbbox((0, 0), subtitle, font=f_sub)
    s_w = s_box[2] - s_box[0]
    draw.text(((W - s_w) // 2, 615), subtitle, font=f_sub, fill=gray)

    # QR Container Box (Clean white background card with rounded corners and gold border)
    box_w, box_h = 960, 960
    box_x = (W - box_w) // 2
    box_y = 690

    # Shadow/Glow effect behind card
    draw.rounded_rectangle([box_x - 12, box_y - 12, box_x + box_w + 12, box_y + box_h + 12], radius=38, fill=(18, 24, 38, 255), outline=gold, width=3)
    draw.rounded_rectangle([box_x, box_y, box_x + box_w, box_y + box_h], radius=32, fill=(255, 255, 255, 255))

    # Paste QR inside container
    qr_img = Image.open(qr_with_logo_path).convert("RGBA")
    qr_img = qr_img.resize((860, 860), Image.Resampling.LANCZOS)
    img.paste(qr_img, (box_x + 50, box_y + 50), qr_img)

    # URL / Call to Action Card below QR
    url_box_y = 1710
    draw.rounded_rectangle([(W - 750) // 2, url_box_y, (W + 750) // 2, url_box_y + 80], radius=40, fill=(20, 27, 44, 255), outline=gold, width=2)
    
    url_bbox = draw.textbbox((0, 0), url_text, font=f_url)
    url_w = url_bbox[2] - url_bbox[0]
    draw.text(((W - url_w) // 2, url_box_y + 16), url_text, font=f_url, fill=gold_light)

    # Instruction
    inst_text = "Scan with your phone's default camera app — No app download required"
    inst_box = draw.textbbox((0, 0), inst_text, font=f_sub)
    inst_w = inst_box[2] - inst_box[0]
    draw.text(((W - inst_w) // 2, 1825), inst_text, font=f_sub, fill=white)

    # Footer divider
    y_fdiv = 2150
    draw.line([180, y_fdiv, W - 180, y_fdiv], fill=(45, 55, 75, 255), width=2)

    # Contact Info Footer
    footer_line1 = "Tel: +971 7 222 868   |   WhatsApp: +971 54 307 2733   |   Instagram: @waless_group"
    f1_box = draw.textbbox((0, 0), footer_line1, font=f_footer)
    f1_w = f1_box[2] - f1_box[0]
    draw.text(((W - f1_w) // 2, 2185), footer_line1, font=f_footer, fill=gold_soft)

    footer_line2 = "Al Dhait South, Ras Al Khaimah, United Arab Emirates"
    f2_box = draw.textbbox((0, 0), footer_line2, font=f_footer)
    f2_w = f2_box[2] - f2_box[0]
    draw.text(((W - f2_w) // 2, 2235), footer_line2, font=f_footer, fill=gray)

    img.save(output_path, "PNG", quality=100)
    print(f"Created Luxury Table Display: {output_path}")

def main():
    qr_dir = "c:\\uae-carservice\\public\\qr"
    logo_file = "c:\\uae-carservice\\public\\waless-logo.png"

    # 1. Embed logo into website QR code
    web_qr = os.path.join(qr_dir, "waless-website-qr.png")
    web_qr_logo = os.path.join(qr_dir, "waless-website-qr-with-logo.png")
    create_qr_with_logo(web_qr, logo_file, web_qr_logo)

    # 2. Embed logo into loyalty QR code
    loyalty_qr = os.path.join(qr_dir, "waless-loyalty-qr.png")
    loyalty_qr_logo = os.path.join(qr_dir, "waless-loyalty-qr-with-logo.png")
    create_qr_with_logo(loyalty_qr, logo_file, loyalty_qr_logo)

    # 3. Create Website Stand Display
    web_stand = os.path.join(qr_dir, "waless-website-counter-display.png")
    create_table_stand_display(
        web_qr_logo,
        web_stand,
        title="SCAN TO VISIT OUR WEBSITE",
        subtitle="Explore luxury vehicle customization, performance & tuning",
        url_text="www.walessgroup.ae",
        badge_label="OFFICIAL WEBSITE"
    )

    # 4. Create Loyalty Program Stand Display
    loyalty_stand = os.path.join(qr_dir, "waless-loyalty-counter-display.png")
    create_table_stand_display(
        loyalty_qr_logo,
        loyalty_stand,
        title="JOIN WALESS VIP REWARDS",
        subtitle="Collect stamps on every service & unlock exclusive rewards",
        url_text="walessgroup.ae/loyalty",
        badge_label="WALESS LOYALTY CLUB"
    )

    print("All branded QR codes and counter displays generated successfully!")

if __name__ == "__main__":
    main()
