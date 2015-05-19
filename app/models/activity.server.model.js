'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Activity Schema
 */
var ActivitySchema = new Schema({
  type: {
    type: String,
    default: '',
    required: 'Please fill Activity type',
    trim: true
  },
  activityData: {
    type: Schema.Types.Mixed
  },
  userAgent: {
    type: String,
    default: '',
    trim: true
  },
  userAgentDeciphered: {
    browser: {
      type: String,
      default: '',
      trim: true
    },
    browserVersion: {
      type: String,
      default: '',
      trim: true
    },
    os: {
      type: String,
      default: '',
      trim: true
    },
    osVersion: {
      type: String,
      default: '',
      trim: true
    },
    device: {
      type: String,
      default: '',
      trim: true
    },
    isMobile: {
      type: String,
      default: '',
      trim: true
    },
    isTablet: {
      type: String,
      default: '',
      trim: true
    },
    isDesktop: {
      type: String,
      default: '',
      trim: true
    },
  },
  machineId: {
    type: String,
    default: '',
    trim: true
  },
  loc: {
    type: [Number], // [<longitude>, <latitude>]
    index: '2d'   // for geospatial index
  },
  created: {
    type: Date,
    default: Date.now
  },
  /* TODO: for logged in users */
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Activity', ActivitySchema);