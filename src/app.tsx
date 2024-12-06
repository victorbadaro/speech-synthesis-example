import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from './components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover';
import { cn } from './lib/utils';

export function App() {
	const [open, setOpen] = useState(false);
	const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
	const [selectedVoice, setSelectedVoice] = useState('Select voice...');
	const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

	useEffect(() => {
		utteranceRef.current = new SpeechSynthesisUtterance();
		speechSynthesis.addEventListener('voiceschanged', populateVoiceOptions);

		return () => {
			speechSynthesis.removeEventListener('voiceschanged', populateVoiceOptions);
		};
	}, []);

	function populateVoiceOptions() {
		const apiVoices = speechSynthesis.getVoices();

		setVoices(apiVoices);

		if (utteranceRef.current) {
			utteranceRef.current.lang = apiVoices[0].lang;
			utteranceRef.current.voice = apiVoices[0];
		}
	}

	return (
		<div className="flex justify-center items-center min-h-screen bg-zinc-900 text-zinc-100">
			<div className="p-4 border rounded-md w-[680px]">
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild className="bg-zinc-900 hover:bg-zinc-900 hover:text-zinc-100">
						{/* biome-ignore lint/a11y/useSemanticElements: <Button /> is a shadcn component */}
						<Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
							{selectedVoice}
							<ChevronsUpDown className="ml-2 h-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-full p-0">
						<Command className="bg-zinc-900 text-zinc-100">
							<CommandInput placeholder="Search voice..." />
							<CommandList>
								<CommandEmpty>No voice found.</CommandEmpty>
								<CommandGroup className="text-zinc-100">
									{voices.map((voice) => (
										<CommandItem
											key={voice.name}
											value={`${voice.name} - ${voice.lang}`}
											onSelect={(currentValue) => {
												setSelectedVoice(currentValue);
												setOpen(false);
											}}
										>
											<Check className={cn('mr-2 h-4 w-4', selectedVoice === `${voice.name} - ${voice.lang}` ? 'opacity-100' : 'opacity-0')} />
											{voice.name} - {voice.lang}
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}
