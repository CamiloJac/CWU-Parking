# @author Kevin Bertelsen

# This script uses openCV to interact with the usb webcam to take a
# 30 second video clip of the specific lot, and save it to an output file
# called outpy.avi, which can be used as input for an object-detection script.

import cv2
import numpy as np
import time

# Create a VideoCapture object
cap = cv2.VideoCapture(0)
capture_duration = 20
# Check if camera opened successfully
if (cap.isOpened() == False):
  print("Camera not found")

# Default resolutions of the frame are obtained.The default resolutions are system dependent.
# We convert the resolutions from float to integer.
frame_width = int(cap.get(3))
frame_height = int(cap.get(4))

# Define the codec and create VideoWriter object.The output is stored in 'outpy.avi' file.
out = cv2.VideoWriter('outpy.avi',cv2.VideoWriter_fourcc('M','J','P','G'), 20, (frame_width,frame_height))

start_time = time.time()
while(int(time.time() - start_time) < capture_duration):
  ret, frame = cap.read()

  if ret == True:

    # Write the frame into the file 'output.avi'
    out.write(frame)

    # Display the resulting frame
    cv2.imshow('frame',frame)

    # Press Q on keyboard to stop recording
    if cv2.waitKey(1) & 0xFF == ord('q'):
      break

  # Break the loop
  else:
    break

# When everything done, release the video capture and video write objects
cap.release()
out.release()

# Closes all the frames
cv2.destroyAllWindows()
