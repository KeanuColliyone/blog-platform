# UploadFile.ps1
# PowerShell script to upload an image to a backend server using a POST request

# Parameters
param (
    [string]$FilePath = "C:\Users\frost\Pictures\Camera Roll\Blaze.jpg", # Replace with your default file path
    [string]$Url = "http://localhost:5000/blogs/upload", # API endpoint for uploading the image
    [string]$BearerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NzMwNjc1MDIwYjZmZTEzOWIwM2FhZSIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsImlhdCI6MTczNTc1OTc4OSwiZXhwIjoxNzM1NzYzMzg5fQ.dF6WQs0ipGTOlmJBBsRaFrmMKkgvcTj5Z8dWKUBllRs" # Replace with your actual JWT token
)

# Verify that the file exists
if (-Not (Test-Path -Path $FilePath)) {
    Write-Error "File not found: $FilePath"
    exit
}

# Load the file
$fileStream = [System.IO.File]::OpenRead($FilePath)
$fileName = [System.IO.Path]::GetFileName($FilePath)

# Create the HTTP client and content
$client = New-Object System.Net.Http.HttpClient
$content = New-Object System.Net.Http.MultipartFormDataContent

# Create the file content
$fileContent = New-Object System.Net.Http.StreamContent($fileStream)
$fileContent.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse("multipart/form-data")
$content.Add($fileContent, "image", $fileName)

# Add the Authorization header
$client.DefaultRequestHeaders.Authorization = New-Object System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", $BearerToken)

try {
    # Send the POST request
    $response = $client.PostAsync($Url, $content).Result

    # Check if the response is successful
    if ($response.IsSuccessStatusCode) {
        Write-Output "Upload succeeded. Response:"
        $response.Content.ReadAsStringAsync().Result
    } else {
        Write-Output "Upload failed. Status code: $($response.StatusCode)"
        $response.Content.ReadAsStringAsync().Result
    }
} catch {
    Write-Output "An error occurred during the upload:"
    Write-Output $_.Exception.Message
} finally {
    # Dispose the client and file stream
    $client.Dispose()
    $fileStream.Dispose()
}