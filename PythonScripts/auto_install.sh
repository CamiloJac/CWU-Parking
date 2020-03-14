# The following script will, when ran, automatically
# install the versions of Python necessary in order to
# run the Python scripts on the Ubuntu 18.04 server.

# Navigate to the directory where the scripts are located,
# make them executable ("chmod +x auto_install.sh")

sudo apt update
sudo apt install software-properties-common

sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt install python3.7
python3.7 --version

if [ $? -eq 0 ]
then
  echo "Successfully installed Python 3.7"
else
  echo "An error has occurred, could not install 3.7" >&2
fi

sudo apt update
sudo apt install python3-pip
pip3 --version

if [ $? -eq 0 ]
then
  echo "Successfully installed pip3"
else
  echo "An error has occurred, could not install pip3" >&2
fi

sudo apt update
sudo apt install python-pip
pip --version

if [ $? -eq 0 ]
then
  echo "Successfully installed pip and Python 2"
else
  echo "An error has occurred, could not install pip" >&2
fi

sudo pip install requests==1.1.0
sudo pip install python-firebase

sudo apt update
sudo apt install python3-opencv

python3 -c "import cv2; print(cv2.__version__)"

if [ $? -eq 0 ]
then
  echo "Successfully openCV"
else
  echo "An error has occurred, could not install openCV or verify its installation" >&2
fi
