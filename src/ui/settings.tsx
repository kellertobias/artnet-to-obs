import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { ApplicationSettings } from '../server/settings';

const SettingsView: React.FC<{}> = () => {
	const [artnetUniverse, setArtnetUniverse] = useState<number>();
	const [startChannel, setStartChannel] = useState<number>();
	const [fps, setFps] = useState<number>();
	const [obsAddress, setObsAddress] = useState<string>();
	const [obsPassword, setObsPassword] = useState<string>();

	useEffect(() => {
		ipcRenderer.invoke('settings/get').then((props: ApplicationSettings) => {
			setArtnetUniverse(props.artnetUniverse);
			setStartChannel(props.startChannel);
			setFps(props.fps);
			setObsAddress(props.obsAddress);
			setObsPassword(props.obsPassword);
		});
	}, []);

	const changeArtnetUniverse: React.ChangeEventHandler<HTMLInputElement> = (
		e,
	) => {
		const value = Number.parseInt(e.currentTarget.value, 10);
		setArtnetUniverse(value);
		ipcRenderer.invoke('settings/set', { artnetUniverse: value });
	};

	const changeStartChannel: React.ChangeEventHandler<HTMLInputElement> = (
		e,
	) => {
		const value = Number.parseInt(e.currentTarget.value, 10);
		setStartChannel(value);
		ipcRenderer.invoke('settings/set', { startChannel: value });
	};

	const changeFps: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		const value = Number.parseInt(e.currentTarget.value, 10);
		setFps(value);
		ipcRenderer.invoke('settings/set', { fps: value });
	};

	const changeObsAddress: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		const value = e.currentTarget.value;
		setObsAddress(value);
		ipcRenderer.invoke('settings/set', { obsAddress: value });
	};

	const changeObsPassword: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		const value = e.currentTarget.value;
		setObsPassword(value);
		ipcRenderer.invoke('settings/set', { obsPassword: value });
	};

	return (
		<div className="view view-settings">
			<div className="view-title">
				<h2>Settings</h2>
			</div>
			<div className="settings-entry">
				<h3>OBS</h3>
				<p>
					<b>Address</b> is the address of the OBS Computer. This is usually
					localhost:4444 or localhost:4449
				</p>
				<input
					value={obsAddress}
					onChange={changeObsAddress}
					placeholder="OBS Address"
				/>
				<p>
					<b>Password</b> OBS Websockets Password. Empty for none.
				</p>
				<input
					value={obsPassword}
					onChange={changeObsPassword}
					placeholder="OBS Password"
				/>
			</div>
			<div className="settings-entry">
				<h3>ArtNET</h3>
				<p>
					<b>Universe</b> is the Universe we listen on (zero based)
				</p>
				<input
					value={artnetUniverse}
					onChange={changeArtnetUniverse}
					placeholder="ArtNET Universe"
				/>
				<p>
					<b>Start Channel</b> One Based Start channel of this fixture (1-510)
				</p>
				<input
					value={startChannel}
					onChange={changeStartChannel}
					placeholder="Start Channel"
				/>
				<p>
					<b>FPS</b> Is used to calculate the fade duration. Each DMX Value is
					one Frame (e.g. 50 fps and fade value of 250 leads to 250 frames which
					are 5 seconds)
				</p>
				<input value={fps} onChange={changeFps} placeholder="FPS" />
			</div>
		</div>
	);
};

export default SettingsView;
