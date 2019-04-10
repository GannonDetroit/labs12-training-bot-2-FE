// displays all posts of a training series
import React, { useState, useEffect } from 'react';

// import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
// Components
// import PostModal from '../Modals/PostModal';
// import PostOptionsModal from '../Modals/PostOptionsModal';
import DeleteModal from '../Modals/deleteModal';
import TrainingSeriesAssignment from './TrainingSeriesAssignment';
// import IconButton from '@material-ui/core/IconButton';

import styled from 'styled-components';

// Redux
import { connect } from 'react-redux';
import {
	getTrainingSeriesPosts,
	createAPost,
	editPost,
	deletePost,
	getMembersAssigned,
	editTrainingSeries,
} from '../../store/actions';

import { withStyles } from '@material-ui/core/styles';

// Styling
import {
	Paper,
	TextField,
	Button,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Typography,
} from '@material-ui/core/';

import AddMemberSnackbar from './AddMembersToTrainingSeries/AddMemberSnackbar';

const styles = theme => ({
	paper: {
		width: '100%',
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[5],
		padding: theme.spacing.unit * 4,
		outline: 'none',
		margin: '5px auto',
		'@media (max-width: 480px)': {
			width: '89%',
			padding: 0,
			margin: '0 auto',
		},
	},
	secondaryAction: {
		display: 'flex',
		flexDirection: 'row',
		'align-items': 'center',
	},
	listItem: {
		width: '79%',
		height: 95,
		marginBottom: 20,
		paddingBottom: 10,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottom: '1px solid #E8E9EB',
		// "list-style": "none"
	},
	icons: {
		display: 'block',
		width: 20,
		marginBottom: 10,
		color: 'gray',
		cursor: 'pointer',
		'&:hover': { color: '#2699FB' },
	},
	hidden: {
		display: 'none',
	},
	button: {
		position: 'relative',
		top: '5px',
		right: '5px',
		width: '160px'
	},
	list: {
		listStyleType: 'none',
	},
	AssignBtn: {},
});
class TrainingSeriesPosts extends React.Component {
	state = {
		active: false,
		displaySnackbar: false,
		editingTitle: false,
	};

	componentDidMount() {
		this.getTrainingSeriesWithPosts(this.props.match.params.id);
		this.props.getMembersAssigned(this.props.match.params.id);
		if (this.props.location.state) {
			this.setState({
				displaySnackbar: this.props.location.state.success,
			});
		}
		this.resetHistory();
	}
	getTrainingSeriesWithPosts = id => {
		this.props.getTrainingSeriesPosts(id);
	};

	deletePost = (e, id) => {
		e.preventDefault();
		console.log(id);
		this.props.deletePost(id);
	};

	routeToPostPage = () => {
		this.props.history.push({
			pathname: '/home/create-post',
			state: {
				trainingSeriesId: this.props.singleTrainingSeries.trainingSeriesID,
			},
		});
	};

	routeToEditPostPage = (e, post) => {
		e.preventDefault();
		console.log('FIRED');
		this.props.history.push({
			pathname: `/home/post/${post.postID}`,
			state: {
				post,
			},
		});
	};

	routeToAssigning = e => {
		e.preventDefault();
		this.props.history.push({
			pathname: `/home/assign-members/${this.props.singleTrainingSeries.trainingSeriesID}`,
		});
	};

	resetHistory = () => {
		this.props.history.replace({
			state: null,
		});
	};

	beginTitleEdit = e => {
		this.setState({
			editingTitle: true,
			title: this.props.singleTrainingSeries.title,
		});
	};

	handleChange = name => event => {
		this.setState({ [name]: event.target.value });
	};

	updateTitle = async e => {
		e.preventDefault();
		const data = { title: this.state.title };
		await this.props.editTrainingSeries(this.props.singleTrainingSeries.trainingSeriesID, data);
		await this.getTrainingSeriesWithPosts(this.props.match.params.id);
		this.setState({
			...this.state,
			editingTitle: false,
		});
	};

	render() {
		const { classes } = this.props;
		let titleEdit;
		if (this.state.editingTitle) {
			titleEdit = (
				<form onSubmit={e => this.updateTitle(e)} noValidate autoComplete="off">
					<TextField
						id="standard-name"
						label="Title"
						className={classes.textField}
						value={this.state.title}
						onChange={this.handleChange('title')}
						margin="normal"
					/>
					<Button type="submit" variant="contained" className={classes.button}>
						Submit
					</Button>
				</form>
			);
		} else {
			titleEdit = (
				<>
					<Typography variant="headline">
						{this.props.singleTrainingSeries.title}
					</Typography>
					<i
						className={`material-icons ${classes.icons}`}
						onClick={e => this.beginTitleEdit(e)}>
						edit
					</i>
				</>
			);
		}
		return (
			<>
				{this.state.displaySnackbar && (
					<>
						<AddMemberSnackbar
							message="Your team members have be successfully added."
							type="success"
						/>
					</>
				)}
				<PageContainer>
					<Paper className={classes.paper}>{titleEdit}</Paper>
					<Paper className={classes.paper}>
						<HeaderContainer>
							<Typography variant="title">Messages</Typography>
							<Button
								variant="outlined"
								className={classes.button}
								onClick={e => this.routeToPostPage(e)}>
								Assign Members
							</Button>
						</HeaderContainer>
						<ListStyles>
							{this.props.posts.map(post => (
								<ListItem key={post.postID} className={classes.listItem}>
									<ListItemText
										primary={post.postName}
										secondary={post.postDetails}
									/>
									<ListItemSecondaryAction className={classes.secondaryAction}>
										{/* <IconButton aria-label="Delete"> */}
										<div>
											<p>{post.daysFromStart} days</p>
										</div>
										<ListButtonContainer>
											<i
												className={`material-icons ${classes.icons}`}
												onClick={e => this.routeToEditPostPage(e, post)}>
												edit
											</i>

											<DeleteModal
												className={`material-icons ${classes.icons}`}
												deleteType="post"
												id={post.postID}
											/>
										</ListButtonContainer>
									</ListItemSecondaryAction>
								</ListItem>
							))}
						</ListStyles>
					</Paper>
					<Paper className={classes.paper}>
						<Typography variant="title">Assigned Team Members</Typography>
						<Button
							variant="outlined"
							className={classes.button}
							onClick={this.routeToAssigning}>
							Assign Members
						</Button>
						{this.props.assignments.map(member => (
							<TrainingSeriesAssignment member={member} />
						))}
					</Paper>
				</PageContainer>
			</>
		);
	}
}

const PageContainer = styled.div`
	display: flex;
	flex-direction: column;
	max-width: 800px;
	width: 100%;
	margin: 0 auto;
`;

const HeaderContainer = styled.div`
	width: 100%;
	margin: 0 auto;
`;

const ButtonContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 250px;
`;

const ListStyles = styled.div`
	display: flex;
	flex-direction: column;
	align-items: space-around;
	width: 100%;
	margin: 20px auto;
	list-style: none;
`;

const ListButtonContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	margin-left: 40px;
`;

const mapStateToProps = state => ({
	isLoading: state.postsReducer.isLoading,
	singleTrainingSeries: state.postsReducer.singleTrainingSeries,
	posts: state.postsReducer.posts,
	assignments: state.trainingSeriesReducer.assignments,
	trainingSeries: state.trainingSeriesReducer.trainingSeries,
});

TrainingSeriesPosts.propTypes = {};

export default connect(
	mapStateToProps,
	{
		getTrainingSeriesPosts,
		createAPost,
		editPost,
		deletePost,
		getMembersAssigned,
		editTrainingSeries,
	}
)(withStyles(styles)(TrainingSeriesPosts));
