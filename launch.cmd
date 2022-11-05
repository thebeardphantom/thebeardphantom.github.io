@ECHO OFF
cd docs
start cmd /c "bundle exec jekyll serve"
TIMEOUT 4