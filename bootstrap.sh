#!/usr/bin/env bash

if [ $UID -ne 0 ]; then
	echo "Error: script must be run as root">&1
	exit 1
fi

# this is to stop weird warnings by Ubuntu
export DEBIAN_FRONTEND=noninteractive

# setup
echo "Installing packages..."
apt-get --quiet update
apt-get --quiet install -y nodejs
apt-get --quiet install -y npm
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
pushd '/vagrant' >/dev/null
npm install
if ! webpack; then
    echo "Error: running webpack failed">&2
    exit 1
fi
# at the end change all the source code to be accessible by the normal user
popd >/dev/null

# start the webserver
# FIXME
# don't start the server from bootstrap script because it blocks the script from completing
# to solve this permanently, can write systemd script
# current solution: SSH in and start it manually
#echo "Starting webserver..."
#npm start
