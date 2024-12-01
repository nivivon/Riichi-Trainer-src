import React from 'react';
import { Container, Row, Button, Col } from 'reactstrap';
import Hand from '../components/Hand';
import { generateHand } from '../scripts/GenerateHand';
import { calculateMinimumShanten } from "../scripts/ShantenCalculator";
import { convertHandToTileIndexArray } from "../scripts/HandConversions";
import { shuffleArray } from '../scripts/Utils';
import { withTranslation } from 'react-i18next';

class ShantenQuiz extends React.Component {
    constructor(props) {
        super(props);
        this.onNewHand = this.onNewHand.bind(this);
        this.state = {
            hand: null,
            shanten: null,
            shuffle: [],
        };
    }

    componentDidMount() {
        this.onNewHand();
    }

    /** Generates a new hand and calculates its shanten. */
    onNewHand() {
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
        });
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

    render() {
        let { t } = this.props;

        return (
            <Container>
                <Row className="mb-2 mt-2">
                    <span>{t("shanten.instructions")}</span>
                </Row>
                <Hand tiles={this.state.hand} showIndexes={true} />
                <Row className="mt-2">
                    <Col xs="6" sm="3" md="3" lg="2">
                        <Button className="btn-block" color="warning" onClick={this.onNewHand}>{t("trainer.newHandButtonLabel")}</Button>
                    </Col>
                </Row>
                <Row className="mt-2">
                    <span>{t("shanten.shantenLabel")} {this.state.shanten}</span>
                </Row>
            </Container>
        );
    }
}

export default withTranslation()(ShantenQuiz);