& npm install
& npm run build
& npm run dist -w

$installer = Get-ChildItem -Path .\release\ -Filter "The Looking-Glass Setup *.exe" | Select-Object -First 1
& $installer.FullName
