
function Update-File {
    param (
        [string]$filePath,
        [int]$level
    )

    $content = Get-Content -Path $filePath -Raw
    $prefix = ""
    if ($level -eq 1) { $prefix = "../" }
    elseif ($level -eq 2) { $prefix = "../../" }

    # New Nav Block
    $newNav = @"
      <nav role="navigation" class="navigation-menu w-nav-menu">
        <a href="${prefix}index.html" class="navigation-link w-nav-link">Home</a>
        <div data-hover="true" data-delay="0" class="w-dropdown">
          <div class="w-dropdown-toggle navigation-link w-nav-link">
            <div>Services</div>
            <div class="w-icon-dropdown-toggle"></div>
          </div>
          <nav class="w-dropdown-list">
            <a href="${prefix}services/360-photography.html" class="w-dropdown-link">360° Photography</a>
            <a href="${prefix}services/360-videography.html" class="w-dropdown-link">360° Videography</a>
            <a href="${prefix}services/drone-360-media.html" class="w-dropdown-link">Drone 360° Media</a>
            <a href="${prefix}services/google-streetview.html" class="w-dropdown-link">Google StreetView</a>
            <a href="${prefix}services/augmented-reality.html" class="w-dropdown-link">Augmented Reality</a>
            <a href="${prefix}services/interactive-virtual-tours.html" class="w-dropdown-link">Interactive Tours</a>
            <a href="${prefix}services/traditional-media.html" class="w-dropdown-link">Traditional Media</a>
            <a href="${prefix}services/virtual-reality.html" class="w-dropdown-link">Virtual Reality</a>
            <a href="${prefix}services/interactive-maps.html" class="w-dropdown-link">Interactive Maps</a>
          </nav>
        </div>
        <div data-hover="true" data-delay="0" class="w-dropdown">
          <div class="w-dropdown-toggle navigation-link w-nav-link">
            <div>Industries</div>
            <div class="w-icon-dropdown-toggle"></div>
          </div>
          <nav class="w-dropdown-list">
            <a href="${prefix}industries/hospitality.html" class="w-dropdown-link">Hospitality & Resorts</a>
            <a href="${prefix}industries/real-estate.html" class="w-dropdown-link">Real Estate</a>
            <a href="${prefix}industries/adventure-tours.html" class="w-dropdown-link">Adventure Tours</a>
            <a href="${prefix}industries/restaurants.html" class="w-dropdown-link">Restaurants</a>
            <a href="${prefix}industries/retreat-centers.html" class="w-dropdown-link">Retreat Centers</a>
            <a href="${prefix}industries/museums.html" class="w-dropdown-link">Museums</a>
            <a href="${prefix}industries/national-parks.html" class="w-dropdown-link">National Parks</a>
            <a href="${prefix}industries/butterfly-gardens.html" class="w-dropdown-link">Butterfly Gardens</a>
            <a href="${prefix}industries/dome-structures.html" class="w-dropdown-link">Dome Structures</a>
            <a href="${prefix}industries/corporate-spaces.html" class="w-dropdown-link">Corporate Spaces</a>
            <a href="${prefix}industries/educational.html" class="w-dropdown-link">Educational</a>
            <a href="${prefix}industries/event-venues.html" class="w-dropdown-link">Event Venues</a>
            <a href="${prefix}industries/farms.html" class="w-dropdown-link">Farms</a>
            <a href="${prefix}industries/hot-springs.html" class="w-dropdown-link">Hot Springs</a>
            <a href="${prefix}industries/therapy-spaces.html" class="w-dropdown-link">Therapy Spaces</a>
          </nav>
        </div>
        <a href="${prefix}portfolio.html" class="navigation-link w-nav-link">Portfolio</a>
        <a href="${prefix}about.html" class="navigation-link w-nav-link">About</a>
        <a href="${prefix}blog/index.html" class="navigation-link w-nav-link">Blog</a>
        <a href="${prefix}contact.html" class="navigation-link w-nav-link">Contact</a>
      </nav>
"@

    # New Footer Services
    $newFooterServices = @"
          <h4>Services</h4>
          <ul>
            <li><a href="${prefix}services/360-photography.html">360° Photography</a></li>
            <li><a href="${prefix}services/360-videography.html">360° Videography</a></li>
            <li><a href="${prefix}services/drone-360-media.html">Drone 360° Media</a></li>
            <li><a href="${prefix}services/google-streetview.html">Google StreetView</a></li>
            <li><a href="${prefix}services/augmented-reality.html">Augmented Reality</a></li>
            <li><a href="${prefix}services/interactive-virtual-tours.html">Interactive Tours</a></li>
            <li><a href="${prefix}services/traditional-media.html">Traditional Media</a></li>
            <li><a href="${prefix}services/virtual-reality.html">Virtual Reality</a></li>
            <li><a href="${prefix}services/interactive-maps.html">Interactive Maps</a></li>
          </ul>
"@

    # New Footer Industries
    $newFooterIndustries = @"
          <h4>Industries</h4>
          <ul>
            <li><a href="${prefix}industries/hospitality.html">Hospitality & Resorts</a></li>
            <li><a href="${prefix}industries/real-estate.html">Real Estate</a></li>
            <li><a href="${prefix}industries/adventure-tours.html">Adventure Tours</a></li>
            <li><a href="${prefix}industries/restaurants.html">Restaurants</a></li>
            <li><a href="${prefix}industries/retreat-centers.html">Retreat Centers</a></li>
            <li><a href="${prefix}industries/museums.html">Museums</a></li>
            <li><a href="${prefix}industries/national-parks.html">National Parks</a></li>
            <li><a href="${prefix}industries/butterfly-gardens.html">Butterfly Gardens</a></li>
            <li><a href="${prefix}industries/dome-structures.html">Dome Structures</a></li>
            <li><a href="${prefix}industries/corporate-spaces.html">Corporate Spaces</a></li>
            <li><a href="${prefix}industries/educational.html">Educational</a></li>
            <li><a href="${prefix}industries/event-venues.html">Event Venues</a></li>
            <li><a href="${prefix}industries/farms.html">Farms</a></li>
            <li><a href="${prefix}industries/hot-springs.html">Hot Springs</a></li>
            <li><a href="${prefix}industries/therapy-spaces.html">Therapy Spaces</a></li>
          </ul>
"@

    # Replace Nav
    $content = $content -replace '(?s)<nav role="navigation" .*? class="navigation-menu w-nav-menu">.*?</nav>', $newNav
    $content = $content -replace '(?s)<nav role="navigation" class="navigation-menu w-nav-menu">.*?</nav>', $newNav

    # Replace Footer Services
    $content = $content -replace '(?s)<h4>Services</h4>.*?</ul>', $newFooterServices

    # Replace Footer Industries
    $content = $content -replace '(?s)<h4>Industries</h4>.*?</ul>', $newFooterIndustries

    Set-Content -Path $filePath -Value $content -Encoding UTF8
    Write-Host "Updated: $filePath"
}

# Process Files
$root = "D:\YouSee360\_WEBSITE"

# Group 0: Root files
$rootFiles = Get-ChildItem -Path $root -Filter *.html | Where-Object { $_.Name -ne "index.html" -and $_.FullName -notlike "*\es\*" }
foreach ($file in $rootFiles) { Update-File -filePath $file.FullName -level 0 }

# Group 1: Subdirs (1 level deep)
$subDirs = @("services", "industries", "locations")
foreach ($dir in $subDirs) {
    $files = Get-ChildItem -Path "$root\$dir" -Filter *.html
    foreach ($file in $files) { Update-File -filePath $file.FullName -level 1 }
}
Update-File -filePath "$root\blog\index.html" -level 1

# Group 2: Sub-subdirs (2 levels deep)
$blogPosts = Get-ChildItem -Path "$root\blog\posts" -Filter *.html
foreach ($file in $blogPosts) { Update-File -filePath $file.FullName -level 2 }
