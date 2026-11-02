import qrcode
from qrcode.image.svg import SvgPathImage
from pathlib import Path
import zipfile

# Output folder
output_dir = Path("ARISE_QR_Codes")
output_dir.mkdir(exist_ok=True)

BASE_URL = "https://arise-human-experiment.netlify.app/r/"

created_files = []

for number in range(1, 36):
    participant_id = f"HE-{number:03d}"
    url = f"{BASE_URL}{participant_id}"

    qr = qrcode.QRCode(
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        border=4,
    )

    qr.add_data(url)
    qr.make(fit=True)

    qr_image = qr.make_image(image_factory=SvgPathImage)

    file_path = output_dir / f"{participant_id}.svg"
    qr_image.save(file_path)

    created_files.append(file_path)

    print(f"Created {participant_id}")

# Create ZIP
zip_path = Path("ARISE_Human_Experiment_QR_Codes.zip")

with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zip_file:
    for file_path in created_files:
        zip_file.write(file_path, arcname=file_path.name)

print()
print("======================================")
print("35 QR CODES CREATED SUCCESSFULLY")
print("======================================")
print(f"Folder: {output_dir}")
print(f"ZIP: {zip_path}")