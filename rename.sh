#!/bin/sh

git filter-branch -f --env-filter '
export GIT_COMMITTER_NAME="zyronon"
export GIT_COMMITTER_EMAIL="zyronon@163.com"
export GIT_AUTHOR_NAME="zyronon"
export GIT_AUTHOR_EMAIL="zyronon@163.com"
'