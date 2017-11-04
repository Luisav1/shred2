// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var shred = require( 'SHRED/shred' );

  // phet-io modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );

  /**
   * Wrapper type for phet/shred's Particle class.
   * @param particle
   * @param phetioID
   * @constructor
   */
  function TParticle( particle, phetioID ) {
    assert && assertInstanceOf( particle, phet.shred.Particle );
    TObject.call( this, particle, phetioID );
  }

  phetioInherit( TObject, 'TParticle', TParticle, {}, {
    documentation: 'The model for a single particle such as an electron, proton, or neutron.'
  } );

  shred.register( 'TParticle', TParticle );

  return TParticle;
} );
