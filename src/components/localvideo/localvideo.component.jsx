import React from 'react';
import _ from 'lodash'
import { useDispatch, useSelector, connect } from 'react-redux';
import "./localvideo.styles.css";

export const LocalVideo = () => {

  const connection = useSelector(state => state.connection);
  const conference = useSelector(state => state.conference);
  const deviceList = useSelector(state => state.deviceList);
  const videoRef = React.createRef();
  const micRef = React.createRef();

  const [ tempLocalTracks, setTempLocalTracks ] = React.useState([]);

  React.useEffect(() => {
    console.log("The connection is: ", connection);
    console.log("The conference is: ", conference);

    window.JitsiMeetJS.createLocalTracks({ devices: ['audio', 'video']})
    .then((tracks) => {
      console.log("The tracks are: ", tracks);
      let devicesIds = _.map(deviceList, device => device.id);
      console.log(" DevicesIds: ", devicesIds);
      for(let track of tracks){
        if( _.indexOf(devicesIds, track.deviceId) !== -1 ){
          setTempLocalTracks( previousState => [...previousState, track] );
        }
      }
    });
  }, []);

  React.useEffect(() => {
    let size = tempLocalTracks.length;
    if(size > 0){
      console.log("Just add: ", tempLocalTracks[size-1]);
      updateLocalTrack(tempLocalTracks[size-1], 'SET');
    }
  }, [tempLocalTracks]);

  //Method for updating local tracks
  const updateLocalTrack = (track, action = 'CLEAR') => {
    if(action === "CLEAR"){
      console.log("Clearing Local Track");
    }else{
      switch(track.type){
        case 'audio':
          if(micRef.current){
            track.attach(micRef.current);
            track.addEventListener(window.JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, onTrackStoppedEvent);
            track.addEventListener(window.JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED, onTrackAudioOutputChangedEvent);
            track.mute();
          }
          break;
        case 'video':
          if(track && videoRef.current){
            track.attach(videoRef.current);
          }
          break;
      }
    }
  };

  const onTrackStoppedEvent = () => {

  };

  const onTrackAudioOutputChangedEvent = () => {

  };


  return(
    <div className="localv-container">
      This is the LocalVideo component
      <video className="video-component" autoPlay='1' ref={videoRef}/>
      <audio className="audio-component" autoPlay='1' muted={true} ref={micRef} />
    </div>
  )
};