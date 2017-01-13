#!/usr/bin/env bash

# this is to stop weird warnings by Ubuntu
export DEBIAN_FRONTEND=noninteractive

# setup
echo "Installing packages..."
apt-get update --quiet
apt-get install --quiet -y nodejs
apt-get install --quiet -y npm
if ! which npm>/dev/null; then
    echo "Error: npm not installed">&2
    exit 1
fi
apt-get install -y --quiet mongodb
# set up node symlink so utilities which are badly written can still find it
! which node>/dev/null && ln -s /usr/bin/nodejs /usr/bin/node
# prevents npm from being overly verbose
npm set loglevel warn
npm install -g nodemon
npm install -g webpack
apt-get install -y --quiet git

# build
echo "Building source..."
if [ ! -d 'meeting-bingo' ]; then 
    git clone -q 'https://github.com/boompig/meeting-bingo.git'
else
    echo "Warning: meeting-bingo already cloned"
fi
pushd 'meeting-bingo' >/dev/null
npm install
if ! webpack; then
    echo "Error: running webpack failed">&2
    exit 1
fi
# at the end change all the source code to be accessible by the normal user
popd >/dev/null
chown -R vagrant:vagrant 'meeting-bingo'

# start the webserver
# FIXME
# don't start the server from bootstrap script because it blocks the script from completing
# to solve this permanently, can write systemd script
# current solution: SSH in and start it manually
#echo "Starting webserver..."
#npm start
