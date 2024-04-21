# T3 Gallery

The codebase from Theo's [T3 App Router Tutorial on YouTube](https://github.com/t3dotgg/t3gallery)

## TODO
[*] make private token for map NEXT_PUBLIC_MAPBOX_TOKEN

## USEFULLL

### Trigger a github action
```bash curl -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/repos/USERNAME/REPOSITORY/dispatches \
  -d '{"event_type":"run-script"}'
```