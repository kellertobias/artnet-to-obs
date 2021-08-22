import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';

import SettingsView from './settings';
import { Status } from '../api/status';

enum ViewName {
	home = 'home',
	settings = 'settings',
}

const ScenesList: React.FC<Record<never, never>> = ({}) => {
	const [status, setStatus] = useState<Status>();

	useEffect(() => {
		const update = () => {
			ipcRenderer.invoke('scenes').then((newStatus: Status) => {
				setStatus(newStatus);
			});
		};
		const listener: (
			event?: Electron.IpcRendererEvent,
			...args: any[]
		) => void = (e, msg) => update();

		ipcRenderer.on('scenes', listener);
		update();

		return () => {
			ipcRenderer.off('scenes', listener);
		};
	}, []);

	return (
		<ol>
			{status?.scenes?.map((name: string, i: number) => (
				<li>
					{name}
					{status?.activeScene == i ? '(active)' : ''}
				</li>
			))}
		</ol>
	);
};

const MainApplication: React.FC<{ theme: 'dark' | 'light' }> = ({ theme }) => {
	const [view, setView] = useState<ViewName>(ViewName.home);

	const buildViewChanger = (
		view: ViewName,
	): React.MouseEventHandler<HTMLButtonElement> => {
		return (e) => {
			e.stopPropagation();
			e.preventDefault();
			setView(view);
		};
	};

	const setViewPlaying = buildViewChanger(ViewName.home);
	const setViewSettings = buildViewChanger(ViewName.settings);

	return (
		<div className={'app theme-' + (theme ?? 'dark')}>
			<div className="title-bar">
				<div className="title">
					<h1>Tobisk Artnet to OBS Proxy</h1>
				</div>
				<div className="settings-button">
					<button
						onClick={
							view === ViewName.settings ? setViewPlaying : setViewSettings
						}
					>
						{view === ViewName.settings ? 'CLOSE' : ''} SETTINGS
					</button>
				</div>
			</div>
			<div className="content">
				{view !== ViewName.home ? null : (
					<>
						<h2>Welcome</h2>
						<p>This appliction translates ArtNET to OBS Scenes.</p>
						<b>Fixture Channels</b>
						<ol>
							<li>Dimmer (does not work yet)</li>
							<li>Transition Time</li>
							<li>Scene Index</li>
						</ol>
						<h2>Scenes:</h2>
						<ScenesList />
					</>
				)}
				{view !== ViewName.settings ? null : <SettingsView />}
			</div>
		</div>
	);
};

export default MainApplication;
