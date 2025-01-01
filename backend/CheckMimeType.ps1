param (
    [Parameter(Mandatory = $true)]
    [string]$FilePath
)

# Ensure the file exists
if (-Not (Test-Path -Path $FilePath)) {
    Write-Output "File does not exist."
    exit
}

# Dictionary of common MIME types
$mimeTypes = @{
    ".jpg" = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".png" = "image/png"
    ".gif" = "image/gif"
}

# Extract the file extension
$fileExtension = [System.IO.Path]::GetExtension($FilePath).ToLower()

# Get the MIME type
if ($mimeTypes.ContainsKey($fileExtension)) {
    $mimeType = $mimeTypes[$fileExtension]
    Write-Output "The MIME type of the file is: $mimeType"
} else {
    Write-Output "Unknown MIME type for extension $fileExtension"
}