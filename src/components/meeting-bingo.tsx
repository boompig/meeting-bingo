import React from "react";

import BingoApi, {IPhrase} from "../bingo-api"
import BingoCard from "./bingo-card";
import Phrases from "./phrases";
import "bootstrap/dist/css/bootstrap.min.css";
import  "../css/style.css";
import "../css/vp-debate-2020.css";


interface IDefaultLandingProps {
	handleShowPhrases(): void;
}

const DefaultLanding : React.FC<IDefaultLandingProps> = (props) => {
	return (<div id="main-wrapper" className="container">
		<h1 className="header">Meeting Bingo</h1>
		<div className="instructions">
			<h2>Instructions</h2>
			<p>Have you ever seen a long and pointless meeting bearing down on you from a distance? Like a tidal wave seen from a small boat in the ocean, you know of the terrible fate about to befall you, yet you are powerless to stop it. But what if you could prepare for just such a calamity? I introduce to you the solution: meeting bingo!</p>
			<p>Before your meeting, think of phrases to put on a bingo card (generated here) which are likely to be said. I personally like phrases in the &quot;pointless buzzword&quot; category, but you don&apos;t have to restrain yourself. Next, print the card, or copy it into a notebook. Carry the notebook into the meeting, and impress your colleagues as you listen attentively, and periodically take notes. In fact, you cross off phrases as they are said, and quietly celebrate if you&apos;re able to get a Bingo!</p>
		</div>
		<button type="button"
			className="btn btn-primary btn-lg get-started-btn"
			onClick={ props.handleShowPhrases }>Get Started</button>
	</div>);
};

interface IVPDebateLandingProps {
	handleShowPhrases(): void;
	handleResetPhrases(phrases: IPhrase[]): void;
}

interface IVPDebateLandingState {
	fighter: string | null;
}

class VPDebateLanding extends React.PureComponent <IVPDebateLandingProps, IVPDebateLandingState> {
	constructor(props: IVPDebateLandingProps) {
		super(props);

		this.state = {
			fighter: null,
		};

		this.selectFighter = this.selectFighter.bind(this);
		this.getPhraseFile = this.getPhraseFile.bind(this);
		this.onContinue = this.onContinue.bind(this);
	}

	getPhraseFile(fighter: string): string {
		switch(this.state.fighter) {
			case "kamala":
				return "vp-debate-kamala-phrases.json";
			case "pence":
				return "vp-debate-pence-phrases.json";
			case "mod":
				return "vp-debate-mod-phrases.json";
			default:
				throw new Error(`Unknown fighter: ${fighter}`);

		}
	}

	onContinue() {
		if (this.state.fighter === null) {
			throw new Error(`Fighter cannot be null on continue`);
		}
		const phraseFile = this.getPhraseFile(this.state.fighter);
		BingoApi.getPhrases(phraseFile).then((phrases: IPhrase[]) => {
			return this.props.handleResetPhrases(phrases);
		}).then(() => {
			this.props.handleShowPhrases();
		})
	}

	selectFighter(fighter: string) {
		this.setState({
			fighter,
		});
	}

	render() {
		return (<div id="main-wrapper" className="container-fluid">
			<h1 className="header">VP Debate 2020</h1>
			<div className="instructions">
				<h4>Choose your fighter!</h4>

				<div className="card-container">

					<div className="card">
						<div className="card-img-top">
							<img src="/img/kamala-harris.jpg" />
						</div>
						<div className="card-body">
							<h5 className="card-title">Kamala Harris</h5>
							<p className="card-text">Kamala Harris is the Democratic Party's VP candidate.
							She is most famous for polling as high as 3% in this year's Democratic primary, and for sending 
							thousands of people to prison for smoking weed in California.
							Marijuana is now legal across California with the sector estimated to be worth tens of billions of dollars.
							To the disappointment of many, she is not, in fact, Maya Rudolph.</p>
							<button type="button" className="btn btn-success form-control"
								disabled={this.state.fighter === "kamala"}
								onClick={ (e) => this.selectFighter("kamala") }>
								{ this.state.fighter === "kamala" ? "Selected" : "Select" }
							</button>
						</div>
					</div>

					<div className="card">
						<div className="card-img-top">
							<img src="/img/mike-pence-cropped.png" />
						</div>
						<div className="card-body">
							<h5 className="card-title">Mike Pence</h5>
							<p className="card-text">Mike Pence is the Republican Party's VP candidate.
							He is most famous for failing to tackle the HIV/AIDS epidemic as the governor Indiana.
							He was later appointed to head President Trump's COVID-19 taskforce.
							He is also known for promoting electroshock therapy to "treat" homosexuality in his former
							career as a radio host.
							He signed the "Religious Freedom Restoration Act" into law, nearly leading the NCAA to boycott the state of Indiana.</p>
							<button type="button" className="btn btn-success form-control"
								disabled={this.state.fighter === "pence"}
								onClick={ (e) => this.selectFighter("pence") }>
									{ this.state.fighter === "pence" ? "Selected" : "Select" }
							</button>
						</div>
					</div>

					<div className="card">
						<div className="card-img-top">
							<img src="/img/susan-page-cropped.png" />
						</div>
						<div className="card-body">
							<h5 className="card-title">Susan Page</h5>
							<p className="card-text">Susan Page is the moderator for tonight's VP debate.
							She is most famous for being the only DC journalist to go completely unnoticed by Trump.
							She has worked for the top hard-hitting news outlet USA Today for 25 years, where she won several awards for "deadline journalism".
							In 2018, she hosted a taxpayer-funded party for a Trump appointee.
							She has written one hagiography and is on track to write another one.</p>
							<button type="button" className="btn btn-success form-control"
								disabled={this.state.fighter === "mod"}
								onClick= { (e) => this.selectFighter("mod") }>
									{ this.state.fighter === "mod" ? "Selected" : "Select" }
							</button>
						</div>
					</div>
				</div>
			</div>
		<button type="button"
			className="btn btn-primary btn-lg get-started-btn"
			disabled={this.state.fighter === null}
			onClick={ (e) => this.onContinue() }>Continue</button>
		</div>);
	}
}


interface IMeetingBingoProps {
	view: string;

	phrases: IPhrase[];
	isStockPhrases: boolean;
	phraseError: string | null;
	shareLink: string | null;

	handleShowPhrases(): void;

	handleDeletePhrase(index: number): void;
	handleAddPhrase(phrase: string): void;
	handleShowBingoCard(): void;
	handleShare(phrases: IPhrase[]): void;
	handleResetPhrases(): void;
}



const MeetingBingo : React.FC<IMeetingBingoProps> = ({view, phrases, isStockPhrases, phraseError, shareLink,
	handleShowPhrases, handleDeletePhrase, handleAddPhrase, handleResetPhrases, handleShowBingoCard,
	handleShare }) => {
	const u = new URL(window.location.href);

	if(view === "/bingo-card") {
		return <BingoCard
			phrases={ phrases }
			onBack={handleShowPhrases} />;
	} else if(view === "/") {
		if (u.searchParams.get("contest") === "vp-debates-2020") {
			return <VPDebateLanding handleShowPhrases={handleShowPhrases}
				handleResetPhrases={handleResetPhrases} />;
		} else {
			return <DefaultLanding
				handleShowPhrases={handleShowPhrases} />;
		}
	} else {
		let isEditable = true;
		if(u.searchParams.get("editable") === "false") {
			isEditable = false;
		}

		return (<div id="main-wrapper" className="container">
			<Phrases phrases={phrases}
				isStockPhrases={isStockPhrases}
				errorMsg={phraseError}
				shareLink={shareLink}
				isEditable={isEditable}

				handleDeletePhrase={handleDeletePhrase}
				handleAddPhrase={handleAddPhrase}
				handleShowBingoCard={handleShowBingoCard}
				handleShare={handleShare}
				handleResetPhrases={handleResetPhrases} />
		</div>);
	}
};

export default MeetingBingo;