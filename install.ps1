& npm install
& npm run clean
& npm run build
& npm run dist

$installer = Get-ChildItem -Path .\dist\ -Filter "The Looking-Glass Setup *.exe" | Select-Object -First 1
& $installer.FullName
