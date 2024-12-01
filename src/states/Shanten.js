import React from 'react';
import { Container, Row, Button, Col, Input, InputGroup, InputGroupAddon, ListGroup, ListGroupItem, ListGroupItemHeading } from 'reactstrap';
import Hand from '../components/Hand';
import Settings from '../components/shanten-quiz/Settings';
import StatsDisplay from '../components/shanten-quiz/StatsDisplay';
import { generateHand } from '../scripts/GenerateHand';
import { calculateMinimumShanten } from "../scripts/ShantenCalculator";
import { convertHandToTileIndexArray } from "../scripts/HandConversions";
import { shuffleArray } from '../scripts/Utils';
import { withTranslation } from 'react-i18next';
import { CSS_CLASSES } from '../Constants';

class ShantenQuiz extends React.Component {
    constructor(props) {
        super(props);
        this.onSettingsChanged = this.onSettingsChanged.bind(this);
        this.onSubmitGuess = this.onSubmitGuess.bind(this);
        this.updateTime = this.onUpdateTime.bind(this);
        this.resetStats = this.resetStats.bind(this);
        this.timerUpdate = null;
        this.timer = null;
        this.state = {
            hand: null,
            shanten: null,
            shuffle: [],
            guess: '',
            history: [],
            settings: {
                useTimer: false,
                time: 10,
            },
            currentTime: 0,
            stats: {
                correctGuesses: 0,
                totalGuesses: 0,
                totalTime: 0,
            }
        };
    }

    componentDidMount() {
        this.onNewHand();
    }

    componentWillUnmount() {
        if (this.timer != null) {
            clearTimeout(this.timer);
            clearInterval(this.timerUpdate);
        }
    }

    onSettingsChanged(settings) {
        if (!settings.useTimer) {
            if (this.timer != null) {
                clearTimeout(this.timer);
                clearInterval(this.timerUpdate);
            }
        }

        this.setState({
            settings: settings
        });
    }

    /** Generates a new hand and calculates its shanten. */
    onNewHand() {
        if (this.timer != null) {
            clearTimeout(this.timer);
            clearInterval(this.timerUpdate);
        }

        let remainingTiles = this.getStartingTiles();
        let generationResult = generateHand(remainingTiles);
        let hand = generationResult.hand;

        let shanten = calculateMinimumShanten(hand);

        let shuffle = convertHandToTileIndexArray(hand);
        shuffle = shuffleArray(shuffle);

        this.setState({
            hand: hand,
            shanten: shanten,
            shuffle: shuffle,
            guess: '',
            currentTime: this.state.settings.time,
        });

        if (this.state.settings.useTimer) {
            this.timer = setTimeout(
                () => {
                    this.onSubmitGuess();
                },
                (this.state.settings.time) * 1000
            );
            this.timerUpdate = setInterval(this.updateTime, 100);
        }
    }

    /**
     * Creates an array containing how many of each tile should be in the wall at the start of the game.
     * @returns {TileCounts} The available tiles.
     */
    getStartingTiles() {
        let availableTiles = Array(38).fill(0);

        for (let i = 1; i < 30; i++) {
            availableTiles[i] = 4;
        }

        for (let i = 31; i < 38; i++) {
            availableTiles[i] = 4;
        }

        return availableTiles;
    }

    getHistoryClassName(guess, shanten) {
        return parseInt(guess) === shanten ? CSS_CLASSES.CORRECT : CSS_CLASSES.INCORRECT
    }

    getHistoryMessage(guess, shanten) {
        if (!guess) {
            return `You did not enter a guess. It was ${shanten}.`;
        }

        return `You guessed ${guess} shanten. It was ${shanten}.`;
    }

    /** Handles the user's guess submission. */
    onSubmitGuess() {
        let { guess, shanten, history, stats, currentTime } = this.state;
        const className = this.getHistoryClassName(guess, shanten);
        const text = this.getHistoryMessage(guess, shanten);
        history.unshift({ text, className });

        stats.totalGuesses += 1;

        if (this.state.settings.useTimer) {
            stats.totalTime += this.state.settings.time - currentTime;
        }

        if (parseInt(guess) === shanten) {
            stats.correctGuesses += 1;
        }

        this.setState({ history, stats });
        this.onNewHand();
    }

    onUpdateTime() {
        if (this.state.currentTime > 0.1) {
            this.setState({
                currentTime: Math.max(this.state.currentTime - 0.1, 0)
            });
        }
    }

    resetStats() {
        this.setState({
            stats: {
                correctGuesses: 0,
                totalGuesses: 0,
                totalTime: 0,
            }
        });
    }

    render() {
        let { t } = this.props;
        const currentTime = this.state.currentTime || 0;

        return (
            <Container>
                <Settings onChange={this.onSettingsChanged} />
                <StatsDisplay values={this.state.stats} onReset={this.resetStats} useTimer={this.state.settings.useTimer} />
                <Row className="mb-2 mt-2">
                    <span>{t("shanten.instructions")}</span>
                </Row>
                <Hand tiles={this.state.hand} showIndexes={this.state.settings.showIndexes} />
                <Row className="mt-2">
                    <Col xs="6" sm="3" md="3" lg="2">
                        <Button className="btn-block" color="warning" onClick={() => this.onNewHand()}>{t("shanten.newHandButtonLabel")}</Button>
                    </Col>
                </Row>
                <Row className="mt-2">
                    <Col xs="12" sm="8" md="6">
                        <InputGroup>
                            <Input type="number" value={this.state.guess} placeholder={t("shanten.guessPlaceholder")} onChange={(e) => this.setState({ guess: e.target.value })} />
                            <InputGroupAddon addonType="append">
                                <Button color="primary" onClick={this.onSubmitGuess}>{t("shanten.submitGuessButtonLabel")}</Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </Col>
                </Row>
                {this.state.settings.useTimer ?
                    <Row className="mt-2" style={{ justifyContent: 'flex-end', marginRight: 1 }}><span>{currentTime.toFixed(1)}</span></Row>
                    : ""
                }
                <ListGroup className="mt-2">
                    <ListGroupItemHeading><span>{t("shanten.historyLabel")}</span></ListGroupItemHeading>
                    {this.state.history.map((entry, index) => (
                        <ListGroupItem key={index} className={entry.className}>{entry.text}</ListGroupItem>
                    ))}
                </ListGroup>
            </Container>
        );
    }
}

export default withTranslation()(ShantenQuiz);