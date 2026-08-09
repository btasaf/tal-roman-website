@echo off
wt --title "Dev Server" wsl -d Ubuntu-24.04 bash -ic "cd /home/asaf/projects/tal-roman-website && npm run dev" ; new-tab --title "Sanity" wsl -d Ubuntu-24.04 bash -ic "cd /home/asaf/projects/tal-roman-website && npm run sanity" ; new-tab --title "Claude" wsl -d Ubuntu-24.04 bash -ic "cd /home/asaf/projects/tal-roman-website && claude.exe '/tal'"
