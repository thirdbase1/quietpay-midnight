$env:GCM_INTERACTIVE = "never"
$lines = @("protocol=https", "host=github.com", "")
$out = $lines | git credential fill
$pass = ($out | Select-String -Pattern "^password=(.*)").Matches.Groups[1].Value
$h = @{"Authorization"="token " + $pass; "User-Agent"="quietpay-setup"}
Invoke-WebRequest -Uri "https://api.github.com/repos/thirdbase1/quietpay-midnight/actions/jobs/102434769304/logs" -Headers $h -OutFile "$env:TEMP/qplog2.txt" -UseBasicParsing -ErrorAction Stop
Write-Output "log saved"
