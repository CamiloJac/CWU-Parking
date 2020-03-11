# @author Kevin Bertelsen

#This script connects to the CWU Parking Application Google Firebase
#and posts a random number to the SPOTS_TAKEN json attribute for a
#specific lot.

from firebase import firebase
import time
import math

firebase = firebase.FirebaseApplication("https://cwu-parking-application.firebaseio.com",None)
start_time = time.time()

res = start_time % 25
res = math.ceil(res)

data = {
    'SPOTS_TAKEN':res
}

#result = firebase.put('/parkingLots/lot1/', '', data)
result = firebase.put('', 'parkingLots/lot1/SPOTS_TAKEN', data)


print(str(result) + " posted to Firebase as " + str(res))
