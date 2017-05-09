BRANCH=master
if [ $# != 0 ]; then
    BRANCH="$1"
fi

git checkout "${BRANCH}" && git pull && rm -rf build && rm -rf dist && npm run build-prod && rsync build/** dist -r
