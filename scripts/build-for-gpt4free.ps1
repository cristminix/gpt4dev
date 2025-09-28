
# rename config
mv src\global\store\config.ts src\global\store\config-old.ts
mv src\global\store\config-g4f.ts src\global\store\config.ts

# run build
pnpm build
# run cp build assets
.\cp-build-assets.ps1

# restore config
mv src\global\store\config.ts src\global\store\config-g4f.ts
mv src\global\store\config-old.ts src\global\store\config.ts

# if dir exist C:\Projects\gpt4free\.deps\gpt4dev\dist remove it
if (Test-Path "C:\Projects\gpt4free\.deps\gpt4dev\dist") {
    Remove-Item "C:\Projects\gpt4free\.deps\gpt4dev\dist" -Recurse -Force
}

# copy   dist dir to C:\Projects\gpt4free\.deps\gpt4dev\dist
Copy-Item "dist" -Destination "C:\Projects\gpt4free\.deps\gpt4dev\dist" -Recurse

# if dir exist C:\Projects\gpt4free\.deps\gpt4dev\dist remove it
# copy   dist dir to C:\Projects\gpt4free\.deps\gpt4dev\dist